// File: src/routes/index.js
// *** CORRECTED ***

const express = require('express');
const router = express.Router(); // Create an Express router instance

// --- Import Specific Route Modules ---
const authRoutes = require('./authRoutes'); // Assuming authRoutes.js is in the same directory
const gigRouter = require('./gigRoutes');     // Assuming gigRoutes.js is in the same directory
// const productRoutes = require('./productRoutes'); // Example for other routes

console.log('[Index Router] Mounting sub-routes...');

// --- Mount the auth routes under the '/auth' path ---
// This tells the mainRouter (mounted at /api in server.js) that any request
// starting with '/api/auth' should be handled by the router from authRoutes.js
router.use('/auth', authRoutes); // Correct prefix relative to /api
console.log('[Index Router] Mounted /auth routes.');

// --- Mount the gig routes under the '/gigs' path ---
// This tells the mainRouter (mounted at /api in server.js) that any request
// starting with '/api/gigs' should be handled by the router from gigRoutes.js
router.use('/gigs', gigRouter); // Correct prefix relative to /api
console.log('[Index Router] Mounted /gigs routes.');

// --- Mount other routers if they exist ---
// router.use('/products', productRoutes);
// router.use('/users', userRoutes);


// --- DO NOT DEFINE SPECIFIC ROUTES WITH FULL PATHS HERE ---
/*
// DELETE THIS BLOCK - These routes belong inside authRoutes.js or other specific routers
const { registerUser, verifyEmail } = require('../controllers/authController');
const { validateRegistration } = require('../middlewares/validation.js');
const handleUpload = require('../middlewares/upload.js');

router.post(
    '/api/auth/register/student', // <-- REMOVE THIS
    handleUpload,
    validateRegistration,
    registerUser
);
*/
// --- END DELETE BLOCK ---


// --- Export the configured router instance ---
module.exports = router;
console.log('[Index Router] Exporting main router.');