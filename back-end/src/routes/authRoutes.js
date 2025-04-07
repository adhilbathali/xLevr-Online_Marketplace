// File: back-end/src/routes/authRoutes.js
// *** CORRECTED /register/student route for Option 1 (Unified User Collection) ***

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // For student registration specifically

// --- Import Models ---
const StudentUser = require('../models/student_user'); // For student-specific data
const User = require('../models/user');          // Generic User model
const authMiddleware = require('../middleware/authMiddleware');

console.log("--- routes/authRoutes.js executing ---");

// --- Multer Configuration ---
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, or JPG allowed.'), false);
        }
    }
});

// === GENERIC USER REGISTRATION ROUTE ===
// (This route remains unchanged - it correctly uses the User model)
router.post('/register', async (req, res) => {
    console.log(">>> TRYING: /api/auth/register Handler (Generic Signup) <<<");
    console.log("Request body:", req.body);
    const { username, email, password, role } = req.body;

    // Validation...
    if (!username || !email || !password || !role) return res.status(400).json({ message: 'Please provide username, email, password, and role.' });
    if (role !== 'student' && role !== 'professional') return res.status(400).json({ message: 'Invalid role specified.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long.' });

    try {
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) return res.status(400).json({ message: 'User with this email already exists.' });
        let userByUsername = await User.findOne({ username });
        if (userByUsername) return res.status(400).json({ message: 'Username is already taken.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ username, email: email.toLowerCase(), password: hashedPassword, role });
        await user.save();
        console.log(`Generic User registered successfully: ${user.email} (${user.role})`);
        res.status(201).json({ message: 'Registration successful!' });

    } catch (err) {
        console.error('Generic Registration Route Error:', err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
         if (err.code === 11000) {
             return res.status(400).json({ message: 'Error saving user: Duplicate value detected.' });
         }
        res.status(500).send('Server error during registration.');
    }
});
console.log("--- routes/authRoutes.js: Defined POST /register (Generic Signup) ---");


// --- STUDENT-SPECIFIC REGISTRATION ROUTE *** CORRECTED FOR OPTION 1 *** ---
// Creates BOTH a User record and a StudentUser record
router.post(
    '/register/student',
    upload.single('idCardPhoto'), // Uses Multer middleware
    async (req, res) => {
        console.log(">>> TRYING: /api/auth/register/student Handler <<<");
        console.log("Multer processed request. req.body:", req.body);
        console.log("Multer processed request. req.file:", req.file);

        try {
            const { firstName, lastName, email, password, university, studentId, graduationYear } = req.body;
            const idCardPhotoInfo = req.file;

            // --- INPUT VALIDATION for student fields ---
             if (!firstName || !lastName || !email || !password || !university || !idCardPhotoInfo) {
                let missingFields = [];
                 // Build the missingFields array...
                 if (!firstName) missingFields.push('firstName');
                 if (!lastName) missingFields.push('lastName');
                 if (!email) missingFields.push('email');
                 if (!password) missingFields.push('password');
                 if (!university) missingFields.push('university');
                 if (!idCardPhotoInfo) missingFields.push('idCardPhoto');
                console.warn(`Student Registration Failed: Missing fields - ${missingFields.join(', ')}`);
                return res.status(400).json({ message: `Missing required student fields: ${missingFields.join(', ')}` });
            }
            if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                console.warn(`Student Registration Failed: Invalid email format.`);
                return res.status(400).json({ message: 'Invalid format for email.' });
            }
            if (!password || password.length < 6) {
               return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
            }
            // --- END STUDENT INPUT VALIDATION ---

            const lowerCaseEmail = email.toLowerCase();

            // --- Check BOTH collections for existing email ---
            let existingStudentUser = await StudentUser.findOne({ email: lowerCaseEmail });
            if (existingStudentUser) {
                 console.warn(`Student Registration Failed: Email already exists in student_users - ${lowerCaseEmail}`);
                 return res.status(400).json({ message: 'This email is already registered as a student.' });
            }
            let existingGenericUser = await User.findOne({ email: lowerCaseEmail });
            if (existingGenericUser) {
                 console.warn(`Student Registration Failed: Email already exists in generic users - ${lowerCaseEmail}`);
                 return res.status(400).json({ message: 'This email is already registered.' });
            }
            // --- End Email Check ---

            // --- Hash Password ---
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // --- Handle File Upload (Placeholder - Implement actual saving) ---
            // TODO: Save req.file.buffer to your storage (disk, S3, etc.)
            // TODO: Get the actual path or URL after saving the file
            console.log("ID Card Photo received, buffer length:", idCardPhotoInfo.buffer.length);
            const idCardPhotoPath = "placeholder/path/to/saved/file.jpg"; // <-- REPLACE WITH ACTUAL PATH/URL

            // ---> STEP 1: Create and Save the Generic User Record <---
            let correspondingGenericUser = new User({
                username: `${firstName.trim()}_${lastName.trim()}_${Date.now()}`.toLowerCase(), // Generate a unique username
                email: lowerCaseEmail,
                password: hashedPassword, // Use the same hashed password
                role: 'student'         // Set the role correctly
            });
            // Use a try-catch specifically for this save in case of unexpected issues
            try {
                 await correspondingGenericUser.save(); // Save to 'users' collection
                 console.log(`Created corresponding generic User record for ${lowerCaseEmail} with ID: ${correspondingGenericUser.id}`);
            } catch (userSaveError) {
                  console.error("Error saving generic User record during student registration:", userSaveError);
                   // Handle potential duplicate key errors if checks somehow failed (e.g., race condition on username)
                   if (userSaveError.code === 11000) {
                       return res.status(400).json({ message: 'Error saving base user record: Duplicate value detected (likely generated username).' });
                   }
                  return res.status(500).json({ message: 'Failed to create base user record.' }); // Stop if base user fails
            }
            // ---> END STEP 1 <---


            // ---> STEP 2: Create and Save the Detailed Student User Record <---
            let studentUserDetails = new StudentUser({
                userId: correspondingGenericUser.id, // <-- Link to the generic User ID
                firstName,
                lastName,
                email: lowerCaseEmail,
                // password: hashedPassword, // OPTIONAL: No real need to store password hash twice
                university,
                studentId,
                graduationYear,
                idCardPhotoPath: idCardPhotoPath, // Store the actual path/URL
                isVerified: false
            });
            // Use a try-catch here too, consider cleanup if this fails after generic user save
             try {
                 await studentUserDetails.save(); // Save to 'student_users' collection
                 console.log(`Created specific StudentUser record for ${lowerCaseEmail} linked to User ID: ${correspondingGenericUser.id}`);
             } catch (studentSaveError) {
                  console.error("Error saving specific StudentUser record:", studentSaveError);
                  // Attempt to clean up the previously created generic user if this fails
                  // This is best-effort cleanup without transactions
                  try {
                       await User.findByIdAndDelete(correspondingGenericUser.id);
                       console.log(`Cleaned up generic User record (${correspondingGenericUser.id}) due to StudentUser save failure.`);
                  } catch (cleanupError) {
                        console.error(`Failed to cleanup generic User record (${correspondingGenericUser.id}):`, cleanupError);
                  }
                  // Handle validation errors from StudentUser schema
                  if (studentSaveError.name === 'ValidationError') {
                     const messages = Object.values(studentSaveError.errors).map(val => val.message);
                     return res.status(400).json({ message: 'Validation Error for student details', errors: messages });
                  }
                  return res.status(500).json({ message: 'Failed to save detailed student record.' });
             }
            // ---> END STEP 2 <---


            // --- Respond Success ---
            console.log(`Student Registration Successful (Both Records Created) for: ${lowerCaseEmail}`);
            res.status(201).json({ message: 'Student registration successful!' });

        } catch (err) { // Catch errors not caught by inner try-catches (e.g., hashing error, file processing)
             console.error('Outer Error during student registration:', err.message);
             console.error('Full Outer Student Registration Error Stack:', err);
             if (err instanceof multer.MulterError) {
                 return res.status(400).json({ message: `File Upload Error: ${err.message}` });
             }
             if (err.message.startsWith('Invalid file type')) {
                 return res.status(400).json({ message: err.message });
             }
             res.status(500).send('Server error during student registration.');
        }
    }
); // End of router.post('/register/student')
console.log("--- routes/authRoutes.js: Defined POST /register/student *** Corrected for Dual Record *** ---");


// === GENERIC LOGIN ROUTE ===
// (This route remains unchanged - it correctly uses the User model)
router.post('/login', async (req, res) => {
    console.log(">>> HIT: /api/auth/login Handler (Generic Login) <<<");
    console.log("Login req.body:", req.body);
    const { email, password } = req.body;

    // Validation...
    if (!email || typeof email !== 'string' || !password) return res.status(400).json({ message: 'Please provide a valid email and password.' });

    try {
        const lowerCaseEmail = email.toLowerCase();
        console.log(`Attempting login for email: ${lowerCaseEmail}`);
        const user = await User.findOne({ email: lowerCaseEmail }); // Checks 'users' collection

        if (!user) {
            console.log(`Login attempt failed: User not found for ${lowerCaseEmail}`);
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        console.log(`Login attempt: User found for ${lowerCaseEmail} (Role: ${user.role})`);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Login attempt failed: Password mismatch for ${lowerCaseEmail}`);
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        console.log(`Login attempt: Password matched for ${lowerCaseEmail}`);

        // Optional Verification Check (if needed for students via StudentUser model)
        // if (user.role === 'student') { /* ... check StudentUser.isVerified ... */ }

        // Create JWT Payload
        const payload = { user: { id: user.id, role: user.role } };
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) { console.error('FATAL ERROR: JWT_SECRET missing'); return res.status(500).json({ message: 'Server config error.' }); }

        jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
            if (err) { console.error("JWT Error:", err); return res.status(500).json({ message: 'Token generation error.' }); }
            console.log(`Login successful, token generated for ${lowerCaseEmail}`);
            res.json({ message: 'Login Successful!', token: token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
        });

    } catch (err) {
        console.error('Generic Login Route Error:', err.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
});
console.log("--- routes/authRoutes.js: Defined POST /login (Generic Login) ---");


// === GET LOGGED-IN USER ROUTE ===
// (This route remains unchanged - uses User model, merges StudentUser details if needed)
router.get('/me', authMiddleware, async (req, res) => {
    console.log(">>> HIT: /api/auth/me Handler <<<");
    try {
        console.log("User ID from token:", req.user.id);
        const user = await User.findById(req.user.id).select('-password'); // Fetch from 'users'

        if (!user) {
            console.warn(`/me route warning: User not found in DB for ID ${req.user.id}`);
            return res.status(404).json({ message: 'User not found.' });
        }
        console.log(`Sending base data for user: ${user.email}`);

        // Merge student details if role is 'student'
        if (user.role === 'student') {
             console.log(`User role is student, attempting to find details in student_users...`);
             // Link via userId if schema was updated, otherwise fallback to email
            const studentDetails = await StudentUser.findOne({ $or: [{ userId: user.id }, { email: user.email }] }).select('-password');
            if (studentDetails) {
                 console.log(`Found student details for ${user.email}`);
                 const combinedData = { ...user.toObject(), ...studentDetails.toObject(), _id: user._id, role: user.role };
                 return res.json(combinedData);
            } else {
                 console.warn(`Student details not found for user ${user.email}. Sending generic data.`);
            }
        }
        res.json(user); // Send generic user data if not student or details not found

    } catch (err) {
        console.error('/me Route Error:', err.message);
        res.status(500).send('Server Error getting user profile.');
    }
});
console.log("--- routes/authRoutes.js: Defined GET /me (Protected) ---");


// --- Export router ---
module.exports = router;
console.log("--- routes/authRoutes.js: Exporting router ---");