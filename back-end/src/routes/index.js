// routes/index.js (REQUIRED CORRECTION)
const express = require('express');
const router = express.Router();

console.log("--- routes/index.js executing ---"); // Log for checking execution order

// --- Import Specific Route Modules ---
const authRoutes = require('./authRoutes'); // Import the routes defined in authRoutes.js

console.log("--- routes/index.js: Imported authRoutes ---"); // Log import success

// --- Mount Routers under specific base paths ---
// This line tells express: "Any request starting with /api/auth should be handled by the authRoutes router"
router.use('/api/auth', authRoutes);

console.log("--- routes/index.js: Mounted /api/auth ---"); // Log mount success

// --- DO NOT define routes like /api/auth/register/student directly here anymore ---
// router.post('/api/auth/register/student', ...); // <--- DELETE THIS if it exists here

// --- Mount other routers if you have them ---
// Example: router.use('/api/users', require('./userRoutes'));

// --- Export the main router ---
module.exports = router;
console.log("--- routes/index.js: Exporting main router ---"); // Log export