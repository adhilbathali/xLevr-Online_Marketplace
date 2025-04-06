// routes/authRoutes.js (Corrected to use StudentUser model from student_user.js)

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Import the CORRECT Student User Model ---
// Adjust the path if your routes folder isn't directly sibling to models folder parent
const StudentUser = require('../models/student_user'); // <-- CHANGED path and variable name

// --- Optional: Import the general User model if needed elsewhere ---
// const User = require('../models/user'); // Example

console.log("--- routes/authRoutes.js executing (using StudentUser model) ---");

// --- Student Registration Route ---
// @route   POST /api/auth/register/student
// Uses the StudentUser model
router.post('/register/student', /* your multer middleware */ async (req, res) => {
    console.log(">>> TRYING: /api/auth/register/student Handler <<<");
    try {
        const { firstName, lastName, email, password, /* other student fields */ } = req.body;

        // Check if student user already exists using the StudentUser model
        let studentUser = await StudentUser.findOne({ email: email.toLowerCase() }); // <-- CHANGED model and variable
        if (studentUser) {
             return res.status(400).json({ message: 'Student with this email already exists.' });
        }

        if (!password) {
             return res.status(400).json({ message: 'Password is required.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new student user instance using the StudentUser model
        studentUser = new StudentUser({ // <-- CHANGED model and variable
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            // role: 'student', // Only include if 'role' is actually part of your student_user schema
            // Add other student-specific fields from req.body/req.file
            // university: req.body.university,
            // studentId: req.body.studentId,
            // idCardPhotoPath: req.file ? req.file.path : null,
            // isVerified: false
        });
        await studentUser.save(); // <-- Save the student user instance

        // TODO: Email verification logic if needed

        res.status(201).json({ message: 'Student registration successful!' });
     } catch(err) {
         console.error('Student Registration Route Error:', err.message);
         console.error('Full Student Registration Error Stack:', err);
         res.status(500).send('Server error during student registration.');
     }
});
console.log("--- routes/authRoutes.js: Defined POST /register/student ---");


// --- Student Login Route ---
// @route   POST /api/auth/login/student
// Uses the StudentUser model for lookup
router.post('/login/student', async (req, res) => {
    console.log(">>> HIT: /api/auth/login/student Handler Reached <<<");
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("Student Login attempt failed: Missing email or password");
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        console.log(`Attempting student login for email: ${email.toLowerCase()}`);
        // Find student user by email using the StudentUser model
        const studentUser = await StudentUser.findOne({ email: email.toLowerCase() }); // <-- CHANGED model and variable

        if (!studentUser) {
            console.log(`Student Login attempt failed: Student not found for ${email.toLowerCase()}`);
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        console.log(`Student Login attempt: Student found for ${email.toLowerCase()}`);

        // Compare password using the found student user's password field
        const isMatch = await bcrypt.compare(password, studentUser.password); // <-- Uses studentUser.password

        if (!isMatch) {
            console.log(`Student Login attempt failed: Password mismatch for ${email.toLowerCase()}`);
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        console.log(`Student Login attempt: Password matched for ${email.toLowerCase()}`);

        // Optional: Check verification on the studentUser object
        // if (!studentUser.isVerified) { ... }

        // Create JWT Payload using the student user's ID and potentially a role
        const payload = {
            user: { // Keep 'user' convention in payload for simplicity, or change if needed
                id: studentUser.id, // <-- Use studentUser.id
                // Determine role: either hardcode 'student' or get from studentUser if it has a role field
                role: studentUser.role || 'student'
            }
        };

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('FATAL ERROR: JWT_SECRET is not defined.');
            return res.status(500).json({ message: 'Server configuration error.' });
        }

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error("JWT Signing Error:", err);
                    console.error("Full JWT Signing Error Stack:", err);
                    return res.status(500).json({ message: 'Error generating login token.' });
                }
                console.log(`Student Login successful, token generated for ${email.toLowerCase()}`);
                // Send back student user details
                res.json({
                    message: 'Login Successful!',
                    token: token,
                    user: { // Keep structure consistent for frontend if possible
                         id: studentUser.id,
                         firstName: studentUser.firstName,
                         lastName: studentUser.lastName,
                         email: studentUser.email,
                         role: studentUser.role || 'student' // Send role back
                         // Add any other fields frontend might need from studentUser
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
console.log("--- routes/authRoutes.js: Defined POST /login/student ---");


// --- Make sure to export the router ---
module.exports = router;
console.log("--- routes/authRoutes.js: Exporting router ---");