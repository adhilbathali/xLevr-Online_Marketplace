// File: back-end/src/routes/authRoutes.js
// *** MODIFIED TO USE MULTER ***

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // <-- Import Multer

// --- Import the CORRECT Student User Model ---
const StudentUser = require('../models/student_user');

console.log("--- routes/authRoutes.js executing (using StudentUser model) ---");

// --- Multer Configuration ---
// Configure how files are stored. You can use memoryStorage or diskStorage.
// diskStorage gives you more control over filename and path.
// For simplicity now, let's use memoryStorage (good for small files, easy setup)
// In production, consider diskStorage or uploading directly to cloud storage.
const storage = multer.memoryStorage(); // Temporarily stores file in memory as a Buffer

// You can add file filtering and limits here too:
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (matches frontend validation)
    fileFilter: (req, file, cb) => {
        // Check mime type (matches frontend validation)
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true); // Accept file
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, or JPG allowed.'), false); // Reject file
        }
    }
}); // Initialize Multer with the storage configuration

// --- Student Registration Route ---
// Apply Multer middleware HERE using upload.single('fieldName')
// 'idCardPhoto' MUST match the 'name' attribute of your file input in the frontend form
router.post(
    '/register/student',
    upload.single('idCardPhoto'), // <-- Use Multer middleware for ONE file named 'idCardPhoto'
    async (req, res) => {
        console.log(">>> TRYING: /api/auth/register/student Handler <<<");
        console.log("Multer processed request. req.body:", req.body); // Check if text fields are here
        console.log("Multer processed request. req.file:", req.file);   // Check if file info is here

        try {
            // Destructure text fields from req.body (populated by Multer)
            const { firstName, lastName, email, password, university, studentId, graduationYear } = req.body;

            // Access file info from req.file (if uploaded)
            const idCardPhotoInfo = req.file; // Contains buffer, mimetype, size, etc.

            // --- INPUT VALIDATION ---
            // 1. Check text fields
            if (!firstName || !lastName || !email || !password || !university ) { // Added university check
                let missingFields = [];
                if (!firstName) missingFields.push('firstName');
                if (!lastName) missingFields.push('lastName');
                if (!email) missingFields.push('email');
                if (!password) missingFields.push('password');
                if (!university) missingFields.push('university'); // Check university
                console.warn(`Student Registration Failed: Missing text fields - ${missingFields.join(', ')}`);
                return res.status(400).json({ message: `Missing required text fields: ${missingFields.join(', ')}` });
            }
            // 2. Check if file was uploaded (Multer adds req.file if successful)
             if (!idCardPhotoInfo) {
                 console.warn(`Student Registration Failed: Missing ID Card Photo`);
                 return res.status(400).json({ message: 'ID card photo is required.' });
             }
            // 3. Check email format (already exists)
            if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Added regex check here too
                console.warn(`Student Registration Failed: Invalid email format.`);
                return res.status(400).json({ message: 'Invalid format for email.' });
            }
            // --- END INPUT VALIDATION ---


            const lowerCaseEmail = email.toLowerCase();

            let studentUser = await StudentUser.findOne({ email: lowerCaseEmail });
            if (studentUser) {
                 console.warn(`Student Registration Failed: Email already exists - ${lowerCaseEmail}`);
                 return res.status(400).json({ message: 'Student with this email already exists.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

             // **TODO: Handle the uploaded file!**
             // Since using memoryStorage, req.file.buffer contains the file data.
             // You likely want to:
             // 1. Save this buffer to disk (e.g., using `fs.writeFile`) with a unique name.
             // 2. OR upload it directly to cloud storage (S3, Cloudinary, etc.).
             // 3. Get the final path or URL of the saved file.
             // For now, let's just log that we have it. We need to store the PATH later.
             console.log("ID Card Photo received, buffer length:", idCardPhotoInfo.buffer.length);
             const idCardPhotoPath = "placeholder/path/to/saved/file.jpg"; // <-- REPLACE THIS with actual path after saving

            studentUser = new StudentUser({
                firstName,
                lastName,
                email: lowerCaseEmail,
                password: hashedPassword,
                university, // Add from req.body
                studentId, // Add from req.body (optional)
                graduationYear, // Add from req.body (optional)
                idCardPhotoPath: idCardPhotoPath, // Store the PATH to the saved image
                isVerified: false // Default verification status
                // role: 'student', // Add if needed
            });

            await studentUser.save();
            console.log(`Student Registration Successful for: ${lowerCaseEmail}`);

            res.status(201).json({ message: 'Student registration successful! Please check your email for verification if applicable.' });

         } catch(err) {
             console.error('Student Registration Route Error:', err.message);
             console.error('Full Student Registration Error Stack:', err);

             // Handle Multer errors (like file size limit)
             if (err instanceof multer.MulterError) {
                 return res.status(400).json({ message: `File Upload Error: ${err.message}` });
             }
             // Handle our custom fileFilter error
              if (err.message.startsWith('Invalid file type')) {
                  return res.status(400).json({ message: err.message });
              }
             // Handle Mongoose validation errors
             if (err.name === 'ValidationError') {
                 const messages = Object.values(err.errors).map(val => val.message);
                 return res.status(400).json({ message: 'Validation Error', errors: messages });
             }

             res.status(500).send('Server error during student registration.');
         }
    }
); // End of router.post

// --- Student Login Route (remains the same) ---
router.post('/login/student', async (req, res) => {
    // !!! IMPORTANT: Login should NOT use multer. It expects application/json !!!
    // Make sure you have app.use(express.json()) in your main server file for this to work.
    console.log(">>> HIT: /api/auth/login/student Handler Reached <<<");
    console.log("Login req.body:", req.body); // Should be parsed by express.json()

    const { email, password } = req.body;

    // --- INPUT VALIDATION ---
    if (!email || typeof email !== 'string' || !password) {
        console.warn("Student Login attempt failed: Missing or invalid email/password.");
        return res.status(400).json({ message: 'Please provide a valid email and password.' });
    }
    // ... rest of login logic remains the same ...
     const lowerCaseEmail = email.toLowerCase();

    try {
        console.log(`Attempting student login for email: ${lowerCaseEmail}`);
        const studentUser = await StudentUser.findOne({ email: lowerCaseEmail });

        if (!studentUser) {
            console.log(`Student Login attempt failed: Student not found for ${lowerCaseEmail}`);
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        console.log(`Student Login attempt: Student found for ${lowerCaseEmail}`);

        const isMatch = await bcrypt.compare(password, studentUser.password);

        if (!isMatch) {
            console.log(`Student Login attempt failed: Password mismatch for ${lowerCaseEmail}`);
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        console.log(`Student Login attempt: Password matched for ${lowerCaseEmail}`);

         // Optional: Check verification status
         // if (!studentUser.isVerified) {
         //     console.log(`Student Login attempt failed: Account not verified for ${lowerCaseEmail}`);
         //     return res.status(403).json({ message: 'Account not verified. Please check your email.' });
         // }


        const payload = { user: { id: studentUser.id, role: studentUser.role || 'student' } };
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('FATAL ERROR: JWT_SECRET is not defined.');
            return res.status(500).json({ message: 'Server configuration error.' });
        }

        jwt.sign( payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    console.error("JWT Signing Error:", err.message);
                    return res.status(500).json({ message: 'Error generating login token.' });
                }
                console.log(`Student Login successful, token generated for ${lowerCaseEmail}`);
                res.json({
                    message: 'Login Successful!', token: token,
                    user: {
                         id: studentUser.id, firstName: studentUser.firstName, lastName: studentUser.lastName,
                         email: studentUser.email, role: studentUser.role || 'student'
                    }
                 });
            }
        );

    } catch (err) {
        console.error('Student Login Route Error:', err.message);
        console.error('Full Student Login Error Stack:', err);
        res.status(500).json({ message: 'Server error during student login.' });
    }
});


console.log("--- routes/authRoutes.js: Defined POST /register/student (with Multer) ---");
console.log("--- routes/authRoutes.js: Defined POST /login/student ---");

// --- Make sure to export the router ---
module.exports = router;
console.log("--- routes/authRoutes.js: Exporting router ---");