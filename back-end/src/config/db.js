const mongoose = require('mongoose');
const path = require('path'); // Import the path module

 // Log the path for debugging
require('dotenv').config();

const connectDB = async () => {
  try {
    // Check if MONGO_URI is loaded correctly
    if (!process.env.MONGO_URI) {
      console.error('ERROR: MONGO_URI is not defined. Check your .env file and path.');
      throw new Error('MONGO_URI not found in environment variables');
    }
    console.log('Attempting to connect to MongoDB...'); // Add log
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully!'); // More explicit success message
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Don't necessarily exit the process immediately during development,
    // maybe just log the error so nodemon doesn't stop constantly
    // process.exit(1);
  }
};

// *** ENSURE THIS LINE IS EXACTLY AS FOLLOWS AND IS THE LAST LINE ***
module.exports = connectDB;