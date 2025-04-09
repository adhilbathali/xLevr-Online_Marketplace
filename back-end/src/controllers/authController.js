// File: controllers/authController.js
const StudentUser = require('../models/student_user'); // Correctly imported
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');     // Import File System module for cleanup
const path = require('path'); // Often useful with paths

// Load .env relative to the location of this controller file
// Ensure the path is correct based on where nodemon starts (usually project root or src)
// require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); // More robust path finding


// --- Logging helper ---
const logInfo = (message) => console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
const logWarn = (message) => console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
const logError = (message, err) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, err || '');


// ===========================================
//        REGISTER USER FUNCTION
// ===========================================
const registerUser = async (req, res) => {
  logInfo('--- Register User Request Received (Controller) ---');
  logInfo(`Request Body: ${JSON.stringify(req.body)}`);
  logInfo(`Request File: ${JSON.stringify(req.file)}`);

  let savedFilePath = req.file ? req.file.path : null; // Store path for potential cleanup

  try {
    const { firstName, lastName, email, password, university, studentId, graduationYear } = req.body;

    // --- Validation ---
    if (!req.file) {
      logError("Controller Error: File not received. Multer issue or missing file in request.");
      // No file path to cleanup here
      return res.status(400).json({ message: 'ID card photo is required and must be a valid image file.' });
    }
    // Add other basic validations if needed (e.g., required text fields)
    if (!firstName || !lastName || !email || !password || !university) {
         logWarn("Controller Warning: Missing required text fields.");
         await attemptCleanup(savedFilePath); // Cleanup uploaded file
         return res.status(400).json({ message: 'Missing required fields (firstName, lastName, email, password, university).' });
    }
    // Add email format and password length checks...
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        logWarn("Controller Warning: Invalid email format.");
        await attemptCleanup(savedFilePath);
        return res.status(400).json({ message: 'Invalid email format.' });
    }
     if (password.length < 6) {
         logWarn("Controller Warning: Password too short.");
         await attemptCleanup(savedFilePath);
         return res.status(400).json({ message: 'Password must be at least 6 characters.' });
     }
    // --- End Validation ---

    const lowerCaseEmail = email.toLowerCase();

    // Check if user exists
    let user = await StudentUser.findOne({ email: lowerCaseEmail });
    if (user) {
      logWarn(`User already exists with email: ${lowerCaseEmail}, sending 400`);
      await attemptCleanup(savedFilePath); // Cleanup the newly uploaded file for the duplicate attempt
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    logInfo(`User does not exist (${lowerCaseEmail}), proceeding...`);

    const verificationToken = crypto.randomBytes(20).toString('hex');
    logInfo('Generated verification token');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    logInfo('Password hashed');

    // Create new StudentUser instance
    const newUserDetails = {
      firstName,
      lastName,
      email: lowerCaseEmail,
      password: hashedPassword,
      university,
      studentId: studentId || null, // Handle optional fields
      graduationYear: graduationYear || null, // Handle optional fields
      idCardPhotoPath: savedFilePath, // Use the correct field name 'idCardPhotoPath'
      verificationToken,
      verificationStatus: 'pending' // Explicitly set initial status
    };

    user = new StudentUser(newUserDetails);

    // *** ADDED DETAILED LOGGING BEFORE SAVE ***
    logInfo(`Attempting to save user object: ${JSON.stringify(user.toObject(), null, 2)}`);
    // *** --------------------------------- ***

    // --- Try saving to Database ---
    try {
      await user.save(); // Attempt to save (this is where validation/DB errors happen)
      logInfo(`User ${lowerCaseEmail} saved to database successfully (ID: ${user.id})`);

    } catch(dbSaveError) {
        logError(`!!! DATABASE SAVE ERROR for ${lowerCaseEmail}:`, dbSaveError); // Log the specific save error

        // Attempt cleanup because save failed
        await attemptCleanup(savedFilePath);

        // Handle specific DB errors and RETURN response
         if (dbSaveError.name === 'ValidationError') {
             const messages = Object.values(dbSaveError.errors).map(val => val.message);
             return res.status(400).json({ message: 'Validation Error', errors: messages });
         }
         if (dbSaveError.code === 11000) { // Duplicate key error
             const field = JSON.stringify(dbSaveError.keyValue);
             logWarn(`Duplicate key error on field(s): ${field}`);
             return res.status(400).json({ message: `Registration failed: Value already exists for ${field}.` });
         }
        // Fallback for other DB save errors
        return res.status(500).json({ message: 'Database error during user save operation.' });
    }
    // --- End Database Save Attempt ---


    // --- Send Verification Email (Only if save was successful) ---
    const { EMAIL_USER, EMAIL_PASS, EMAIL_SERVICE, BASE_URL } = process.env;
    if (!EMAIL_USER || !EMAIL_PASS || !BASE_URL) {
        logError("Email credentials or BASE_URL not found in .env file. Cannot send verification email.");
        return res.status(201).json({ message: 'Registration successful, but could not send verification email (server config issue).' });
    }

    const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE || 'gmail',
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });

    const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const verificationLink = `${cleanBaseUrl}/api/auth/verify-email/${verificationToken}`;
    logInfo(`Constructed Verification Link: ${verificationLink}`);

    const mailOptions = {
      from: `"Xlever Marketplace" <${EMAIL_USER}>`,
      to: lowerCaseEmail,
      subject: 'Verify Your Xlever Student Account',
      html: `<p>Thank you for registering with Xlever Marketplace!</p><p>Please click the following link to verify your email address:</p><p><a href="${verificationLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email Address</a></p><p>Link: ${verificationLink}</p><p>If you didn't register for this account, please ignore this email.</p>`,
      text: `Thank you for registering! Please visit the following link to verify your email address: ${verificationLink}`
    };

    try {
      logInfo(`Attempting to send verification email to: ${lowerCaseEmail}`);
      let info = await transporter.sendMail(mailOptions);
      logInfo(`Verification email sent successfully to ${lowerCaseEmail}: ${info.response}`);
      res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });

    } catch (emailError) {
      logError(`!!! Email Sending Error for ${lowerCaseEmail}:`, emailError);
      res.status(201).json({ message: 'Registration successful, but failed to send verification email. Please contact support or request verification again.' });
    }
    // --- End Send Verification Email ---


  } catch (err) { // Outer catch for errors before save attempt (hashing etc.) or unexpected issues
    logError('!!! OUTER SERVER ERROR in registerUser Controller:', err);
    await attemptCleanup(savedFilePath); // Ensure cleanup even for outer errors if file exists
    res.status(500).json({ message: 'Server error during registration process.' });
  }
}; // End of registerUser Function


// ===========================================
//        VERIFY EMAIL FUNCTION
// ===========================================
const verifyEmail = async (req, res) => {
    logInfo('--- Verify Email Request Received (Controller) ---');
    const { token } = req.params;
    logInfo(`Token from params: ${token}`);

    const { FRONT_END_URL } = process.env;
    if (!FRONT_END_URL) {
        logError("FRONT_END_URL not found in .env file. Cannot redirect after verification.");
        return res.status(500).send('Server configuration error: Cannot complete verification process.');
    }
    const cleanFrontEndUrl = FRONT_END_URL.endsWith('/') ? FRONT_END_URL.slice(0, -1) : FRONT_END_URL;

    try {
        if (!token) {
             logWarn('Verification token missing from request.');
             return res.status(400).send('Verification token missing.');
        }

        // Find user by token
        const user = await StudentUser.findOne({ verificationToken: token });

        if (!user) {
            logWarn(`Invalid or expired token received: ${token}`);
            return res.redirect(`${cleanFrontEndUrl}/verification-failed?reason=invalid-token`);
        }

        if (user.verificationStatus === 'verified') {
            logInfo(`User ${user.email} already verified.`);
             return res.redirect(`${cleanFrontEndUrl}/verification-success?message=already-verified`);
        }

        // Update user status
        user.verificationStatus = 'verified';
        user.verificationToken = undefined; // Clear the token
        await user.save();
        logInfo(`User email verified successfully: ${user.email}`);

        res.redirect(`${cleanFrontEndUrl}/verification-success`);

    } catch (err) {
        logError('!!! SERVER ERROR during email verification:', err);
        res.redirect(`${cleanFrontEndUrl}/verification-failed?reason=server-error`);
    }
}; // End of verifyEmail Function


// ===========================================
//        HELPER FUNCTIONS
// ===========================================

// --- File Cleanup Helper ---
async function attemptCleanup(filePath) {
    if (!filePath) return;
    logInfo(`Controller: Attempting cleanup of file: ${filePath}`);
    try {
        // Use existsSync before unlink to avoid error if path is somehow invalid
        if (fs.existsSync(filePath)) {
             await fs.promises.unlink(filePath);
             logInfo(`Controller: Successfully deleted file: ${filePath}`);
        } else {
             logWarn(`Controller: File not found for cleanup, skipping: ${filePath}`)
        }
    } catch (unlinkErr) {
        // Log error but don't fail the request because of cleanup failure
        logError(`Controller: Failed to delete file during cleanup: ${filePath}`, unlinkErr);
    }
}


// ===========================================
//        MODULE EXPORTS
// ===========================================
module.exports = {
    registerUser,
    verifyEmail
};