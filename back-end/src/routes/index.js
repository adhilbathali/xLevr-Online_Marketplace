// routes/index.js
const express = require('express');
const router = express.Router();

const gigRouter = require('./gigRoutes');

// --- Import Controllers and Middleware ---
const { registerUser, verifyEmail } = require('../controllers/authController'); // Go up one level, then into controllers
const { validateRegistration } = require('../middlewares/validation.js');   // Go up one level, then into middleware
const handleUpload = require('../middlewares/upload.js');                // Go up one level, then into middleware
// inside routes/index.js
router.post(
    '/api/auth/register/student', // <--- THIS IS THE CORRECT PATH
    handleUpload,
    validateRegistration,
    registerUser
);

router.use('/api/gigs', gigRouter);

// ... rest of the file ...

module.exports = router;