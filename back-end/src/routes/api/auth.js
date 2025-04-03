// routes/api/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail } = require('../../controllers/authController');
const { validateRegistration } = require('../../middleware/validation.js');
const handleUpload = require('../../middleware/upload'); // Use the combined upload handler

// @route   POST api/auth/register/student
// @desc    Register a new student user
// @access  Public
// Order: 1. Upload Middleware, 2. Validation Middleware, 3. Controller
router.post(
    '/register/student',
    handleUpload, // Handles file upload and upload errors
    validateRegistration, // Handles validation of text fields
    registerUser // Handles the core registration logic
);

// @route   GET api/auth/verify-email/:token
// @desc    Verify user email
// @access  Public
router.get('/verify-email/:token', verifyEmail);

module.exports = router;