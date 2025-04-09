// File: back-end/src/routes/authRoutes.js
// *** CORRECTED /register/student route for Option 1 (Unified User Collection) ***
// *** Implemented file saving with diskStorage ***

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path'); // Needed for file extensions and paths
const fs = require('fs');     // Needed for directory creation

// --- Import Models ---
const StudentUser = require('../models/student_user'); // For student-specific data
const User = require('../models/user');          // Generic User model
const authMiddleware = require('../middlewares/authMiddlewares');

// --- Logging helper ---
const logInfo = (message) => console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
const logWarn = (message) => console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
const logError = (message, err) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, err || '');

logInfo("--- routes/authRoutes.js executing ---");

// --- Define Uploads Directory ---
// It's often better to store uploads outside the 'src' directory if possible
// Example: 'back-end/uploads' relative to the project root
// Adjust this path based on your project structure where server.js is run
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads'); // Moves one level up from 'src' to 'back-end', then into 'uploads'
logInfo(`Uploads directory set to: ${UPLOADS_DIR}`);

// --- Ensure Uploads Directory Exists ---
if (!fs.existsSync(UPLOADS_DIR)) {
    try {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        logInfo(`Created uploads directory: ${UPLOADS_DIR}`);
    } catch (err) {
        logError(`Failed to create uploads directory: ${UPLOADS_DIR}`, err);
        // Consider exiting if the upload dir is critical and cannot be created
        // process.exit(1);
    }
} else {
    logInfo(`Uploads directory already exists: ${UPLOADS_DIR}`);
}


// --- Multer Configuration (Using diskStorage) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR); // Save files to the defined uploads directory
    },
    filename: function (req, file, cb) {
        // Create a unique filename: fieldname-timestamp.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname); // Get original extension
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Allowed extensions
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            // Reject file
            cb(new Error('Invalid file type. Only JPEG, PNG, or JPG allowed.'), false);
        }
    }
});
// === END Multer Configuration ===


// === GENERIC USER REGISTRATION ROUTE ===
// (Remains unchanged - assumed correct)
router.post('/register', async (req, res) => {
    logInfo(">>> TRYING: /api/auth/register Handler (Generic Signup) <<<");
    logInfo(`Request body: ${JSON.stringify(req.body)}`);
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) return res.status(400).json({ message: 'Please provide username, email, password, and role.' });
    if (role !== 'student' && role !== 'professional') return res.status(400).json({ message: 'Invalid role specified.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Invalid email format.' });


    try {
        const lowerCaseEmail = email.toLowerCase();
        let user = await User.findOne({ email: lowerCaseEmail });
        if (user) return res.status(400).json({ message: 'User with this email already exists.' });
        let userByUsername = await User.findOne({ username }); // Case-sensitive check for username
        if (userByUsername) return res.status(400).json({ message: 'Username is already taken.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ username, email: lowerCaseEmail, password: hashedPassword, role });
        await user.save();
        logInfo(`Generic User registered successfully: ${user.email} (${user.role})`);
        res.status(201).json({ message: 'Registration successful!' });

    } catch (err) {
        logError('Generic Registration Route Error:', err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
         if (err.code === 11000) { // Duplicate key error (likely email or username if unique index exists)
             return res.status(400).json({ message: 'Error saving user: Email or Username already exists.' });
         }
        res.status(500).send('Server error during registration.');
    }
});
logInfo("--- routes/authRoutes.js: Defined POST /register (Generic Signup) ---");


// --- STUDENT-SPECIFIC REGISTRATION ROUTE *** CORRECTED FOR FILE SAVING *** ---
// Creates BOTH a User record and a StudentUser record
router.post(
    '/register/student',
    upload.single('idCardPhoto'), // Uses Multer middleware with diskStorage
    async (req, res) => {
        logInfo(">>> TRYING: /api/auth/register/student Handler <<<");
        logInfo(`req.body: ${JSON.stringify(req.body)}`); // Log text fields
        logInfo(`req.file: ${JSON.stringify(req.file)}`); // Log file info (path will be available now)

        // Define variables for potential cleanup later
        let savedFilePath = req.file ? req.file.path : null;
        let createdGenericUserId = null;

        try {
            const { firstName, lastName, email, password, university, studentId, graduationYear } = req.body;
            const idCardPhotoInfo = req.file; // File info from multer (includes path)

            // --- INPUT VALIDATION for student fields ---
            let missingFields = [];
            if (!firstName) missingFields.push('firstName');
            if (!lastName) missingFields.push('lastName');
            if (!email) missingFields.push('email');
            if (!password) missingFields.push('password');
            if (!university) missingFields.push('university');
            // studentId and graduationYear might be optional depending on your schema, adjust if needed
            if (!idCardPhotoInfo) missingFields.push('idCardPhoto (file)'); // Check if file was uploaded

            if (missingFields.length > 0) {
                logWarn(`Student Registration Failed: Missing fields - ${missingFields.join(', ')}`);
                // If file was missing, savedFilePath is null. If other fields missing but file uploaded, attempt cleanup
                if (savedFilePath) await attemptCleanup(savedFilePath);
                return res.status(400).json({ message: `Missing required student fields: ${missingFields.join(', ')}` });
            }

            if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                logWarn(`Student Registration Failed: Invalid email format.`);
                if (savedFilePath) await attemptCleanup(savedFilePath);
                return res.status(400).json({ message: 'Invalid format for email.' });
            }
            if (!password || password.length < 6) {
                logWarn(`Student Registration Failed: Password too short.`);
                if (savedFilePath) await attemptCleanup(savedFilePath);
               return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
            }
            // --- END STUDENT INPUT VALIDATION ---

            const lowerCaseEmail = email.toLowerCase();

            // --- Check BOTH collections for existing email ---
            let existingStudentUser = await StudentUser.findOne({ email: lowerCaseEmail });
            let existingGenericUser = await User.findOne({ email: lowerCaseEmail });

            if (existingStudentUser || existingGenericUser) {
                 const existsIn = existingStudentUser ? 'student_users' : 'users';
                 logWarn(`Student Registration Failed: Email already exists in ${existsIn} - ${lowerCaseEmail}`);
                 if (savedFilePath) await attemptCleanup(savedFilePath);
                 return res.status(400).json({ message: 'This email is already registered.' });
            }
            // --- End Email Check ---

            // --- Hash Password ---
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // --- Get Actual File Path ---
            // No longer a placeholder! Multer saved it, path is in req.file.path
            const idCardPhotoPath = savedFilePath; // Use the path from multer
            logInfo(`ID Card Photo saved to path: ${idCardPhotoPath}`);


            // ---> STEP 1: Create and Save the Generic User Record <---
            let correspondingGenericUser = new User({
                // Generate a unique username - ensuring it's not likely to collide
                username: `${firstName.trim()}_${lastName.trim()}_${Date.now()}`.toLowerCase().replace(/\s+/g, '_'),
                email: lowerCaseEmail,
                password: hashedPassword,
                role: 'student'
            });
            // Use try-catch for this save
            try {
                 await correspondingGenericUser.save();
                 createdGenericUserId = correspondingGenericUser.id; // Store ID for potential cleanup
                 logInfo(`Created corresponding generic User record for ${lowerCaseEmail} with ID: ${createdGenericUserId}`);
            } catch (userSaveError) {
                logError("Error saving generic User record:", userSaveError);
                if (savedFilePath) await attemptCleanup(savedFilePath); // Cleanup file
                 if (userSaveError.code === 11000) {
                     return res.status(400).json({ message: 'Error saving base user record: Duplicate value detected (likely generated username).' });
                 }
                return res.status(500).json({ message: 'Failed to create base user record.' }); // Stop if base user fails
            }
            // ---> END STEP 1 <---


            // ---> STEP 2: Create and Save the Detailed Student User Record <---
            let studentUserDetails = new StudentUser({
                userId: createdGenericUserId, // Link to the generic User ID
                firstName,
                lastName,
                email: lowerCaseEmail,
                // password: hashedPassword, // Not needed here, stored in User model
                university,
                studentId, // Ensure this field exists in your StudentUser schema
                graduationYear, // Ensure this field exists in your StudentUser schema
                idCardPhotoPath: idCardPhotoPath, // Store the ACTUAL path
                isVerified: false // Default to not verified
            });
            // Use try-catch here too
             try {
                 await studentUserDetails.save();
                 logInfo(`Created specific StudentUser record for ${lowerCaseEmail} linked to User ID: ${createdGenericUserId}`);
             } catch (studentSaveError) {
                 logError("Error saving specific StudentUser record:", studentSaveError);
                 // Attempt cleanup of BOTH file and generic user
                 if (savedFilePath) await attemptCleanup(savedFilePath);
                 if (createdGenericUserId) await attemptUserCleanup(createdGenericUserId);

                  if (studentSaveError.name === 'ValidationError') {
                     const messages = Object.values(studentSaveError.errors).map(val => val.message);
                     return res.status(400).json({ message: 'Validation Error for student details', errors: messages });
                  }
                  return res.status(500).json({ message: 'Failed to save detailed student record.' });
             }
            // ---> END STEP 2 <---


            // --- Respond Success ---
            logInfo(`Student Registration Successful (Both Records Created) for: ${lowerCaseEmail}`);
            res.status(201).json({ message: 'Student registration successful!' });

        } catch (err) { // Catch errors not caught by inner try-catches
             logError('Outer Error during student registration:', err.message);
             logError('Full Outer Student Registration Error Stack:', err);

             // Attempt cleanup if resources were created before error
             if (savedFilePath) await attemptCleanup(savedFilePath);
             if (createdGenericUserId) await attemptUserCleanup(createdGenericUserId);


             if (err instanceof multer.MulterError) {
                 return res.status(400).json({ message: `File Upload Error: ${err.message}` });
             }
             // Handle the specific file filter error message
             if (err.message.startsWith('Invalid file type')) {
                 return res.status(400).json({ message: err.message });
             }
             res.status(500).send('Server error during student registration.');
        }
    }
); // End of router.post('/register/student')
logInfo("--- routes/authRoutes.js: Defined POST /register/student *** Corrected for File Saving *** ---");


// === GENERIC LOGIN ROUTE ===
// (Remains unchanged - Assumed correct)
router.post('/login', async (req, res) => {
    logInfo(">>> HIT: /api/auth/login Handler (Generic Login) <<<");
    logInfo(`Login req.body: ${JSON.stringify(req.body)}`);
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !password) return res.status(400).json({ message: 'Please provide a valid email and password.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Invalid email format.' });

    try {
        const lowerCaseEmail = email.toLowerCase();
        logInfo(`Attempting login for email: ${lowerCaseEmail}`);
        const user = await User.findOne({ email: lowerCaseEmail }); // Checks 'users' collection

        if (!user) {
            logInfo(`Login attempt failed: User not found for ${lowerCaseEmail}`);
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        logInfo(`Login attempt: User found for ${lowerCaseEmail} (Role: ${user.role})`);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logInfo(`Login attempt failed: Password mismatch for ${lowerCaseEmail}`);
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        logInfo(`Login attempt: Password matched for ${lowerCaseEmail}`);

        // Here you might add a check for student verification status if needed
        if (user.role === 'student') {
            const studentDetails = await StudentUser.findOne({ $or: [{ userId: user.id }, { email: user.email }] });
            if (!studentDetails || !studentDetails.isVerified) {
                logWarn(`Login attempt blocked: Student ${lowerCaseEmail} is not verified.`);
                // Decide response: could be 403 Forbidden or specific message
                // return res.status(403).json({ message: 'Account not verified. Please check instructions.' });
            }
        }

        const payload = { user: { id: user.id, role: user.role } };
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) { logError('FATAL ERROR: JWT_SECRET missing'); return res.status(500).json({ message: 'Server config error.' }); }

        jwt.sign(payload, jwtSecret, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }, (err, token) => {
            if (err) { logError("JWT Error:", err); return res.status(500).json({ message: 'Token generation error.' }); }
            logInfo(`Login successful, token generated for ${lowerCaseEmail}`);
            res.json({
                message: 'Login Successful!',
                token: token,
                user: { // Send back essential, non-sensitive data
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        });

    } catch (err) {
        logError('Generic Login Route Error:', err.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
});
logInfo("--- routes/authRoutes.js: Defined POST /login (Generic Login) ---");


// === GET LOGGED-IN USER ROUTE ===
// (Remains unchanged - Assumed Correct)
router.get('/me', authMiddleware, async (req, res) => {
    logInfo(">>> HIT: /api/auth/me Handler <<<");
    try {
        logInfo(`User ID from token: ${req.user.id}`);
        // Fetch base user data first
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            logWarn(`/me route warning: User not found in DB for ID ${req.user.id}`);
            return res.status(404).json({ message: 'User not found.' });
        }
        logInfo(`Sending base data for user: ${user.email}`);

        // If user is a student, fetch and merge details
        if (user.role === 'student') {
            logInfo(`User role is student, attempting to find details in student_users...`);
             // Find student details using the userId link primarily
            const studentDetails = await StudentUser.findOne({ userId: user.id }).select('-password -_id -email'); // Exclude redundant/sensitive fields

            if (studentDetails) {
                logInfo(`Found student details for ${user.email}`);
                // Combine generic user data with specific student data
                // Ensure generic user _id and role take precedence
                const combinedData = {
                    ...studentDetails.toObject(), // Spread student details first
                    ...user.toObject(), // Spread generic user details, overwriting email, adding _id, password (already excluded), role, username
                    // Explicitly set primary fields from User model if needed
                     _id: user._id,
                     role: user.role,
                     email: user.email,
                     username: user.username
                };
                return res.json(combinedData);
            } else {
                logWarn(`Student details not found for user ${user.email} (ID: ${user.id}). Sending generic data.`);
            }
        }
        // Send only generic user data if not student or details missing
        res.json(user);

    } catch (err) {
        logError('/me Route Error:', err.message);
        res.status(500).send('Server Error getting user profile.');
    }
});
logInfo("--- routes/authRoutes.js: Defined GET /me (Protected) ---");


// --- Cleanup Helper Functions ---
// Best-effort file cleanup
async function attemptCleanup(filePath) {
    if (!filePath) return;
    logInfo(`Attempting cleanup of file: ${filePath}`);
    try {
        await fs.promises.unlink(filePath);
        logInfo(`Successfully deleted file: ${filePath}`);
    } catch (unlinkErr) {
        // Log error but don't fail the request because of cleanup failure
        logError(`Failed to delete file during cleanup: ${filePath}`, unlinkErr);
    }
}
// Best-effort user record cleanup
async function attemptUserCleanup(userId) {
     if (!userId) return;
     logInfo(`Attempting cleanup of generic User record: ${userId}`);
     try {
          await User.findByIdAndDelete(userId);
          logInfo(`Successfully deleted generic User record: ${userId}`);
     } catch (cleanupError) {
          logError(`Failed to delete generic User record during cleanup: ${userId}`, cleanupError);
     }
}


// --- Export router ---
module.exports = router;
logInfo("--- routes/authRoutes.js: Exporting router ---");