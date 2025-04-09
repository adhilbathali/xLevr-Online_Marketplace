// File: server.js (likely in src directory)
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv'); // Require it explicitly

// --- LOAD .env FILE WITH CORRECT EXPLICIT PATH ---
// ** Since .env is in 'back-end' (parent of 'src' where server.js likely is) **
const envPath = path.join(__dirname, '..', '.env');

console.log(`[Server] Attempting to load .env file from: ${envPath}`); // Log the path being checked
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
    console.error(`[Server] ERROR loading .env file from ${envPath}:`, dotenvResult.error);
    console.warn("[Server] Ensure the .env file exists at the specified path and has read permissions.");
    process.exit(1); // Exit if .env fails to load
} else if (!process.env.MONGO_URI) {
    console.error(`[Server] ERROR: MONGO_URI not found in process.env AFTER loading ${envPath}.`);
    console.warn("[Server] Check the .env file content: Is MONGO_URI spelled correctly? Is it commented out (#)? Does it have a value?");
    process.exit(1); // Exit if critical variable is missing
} else {
    console.log("[Server] .env file loaded successfully.");
    // Avoid logging full URI in production environments
    // console.log(`[Server] MONGO_URI loaded: ${process.env.MONGO_URI.substring(0, 20)}...`);
}
// --- END .env Loading ---


const connectDB = require('./config/db'); // Assuming db.js is in src/config
const mainRouter = require('./routes/index'); // Assuming index.js is in src/routes

// --- Connect to Database ---
// connectDB() will now use the MONGO_URI loaded above
connectDB();
// --- End Connect DB ---


const app = express();

app.use(cors());
app.use(express.json()); // Body parser for JSON

// Serve static files from 'uploads' directory (ensure path is correct)
// If uploads is in 'back-end' (parent of src), this is correct
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Mount the main router
app.use('/api', mainRouter); // Mount API routes under /api

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});