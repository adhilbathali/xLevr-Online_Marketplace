// File: config/db.js
const mongoose = require('mongoose');
// const path = require('path'); // No longer needed here

// --- REMOVE dotenv loading from this file ---
// const envPath = path.resolve(__dirname, '../.env');
// console.log(`Loading .env file from: ${envPath}`); // REMOVE
// require('dotenv').config({ path: envPath }); // REMOVE
// --- End Removal ---


const connectDB = async () => {
  try {
    // Check if MONGO_URI was loaded correctly BY server.js
    // process.env variables are globally available once loaded
    const mongoUriFromEnv = process.env.MONGO_URI;

    if (!mongoUriFromEnv) {
      // This check is still useful as a safeguard
      console.error('ERROR inside connectDB: MONGO_URI is undefined. Ensure .env is loaded correctly in server.js.');
      // Optionally re-throw or handle gracefully depending on desired server behavior
      throw new Error('MONGO_URI not found in environment variables when connectDB was called');
    }

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoUriFromEnv); // Use the variable read from process.env
    console.log('MongoDB Connected Successfully!');

  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Consider exiting only on critical failure, otherwise log allows nodemon to restart
     process.exit(1); // Exit if connection fails - often desired behavior
  }
};

// Ensure this is the absolute last line
module.exports = connectDB;