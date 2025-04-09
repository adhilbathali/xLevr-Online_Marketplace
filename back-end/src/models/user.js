    // back-end/src/models/user.js
    const mongoose = require('mongoose');

    const UserSchema = new mongoose.Schema({
        username: {
            type: String,
            required: [true, 'Username is required.'],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
            minlength: [6, 'Password must be at least 6 characters long.'] // Or your preferred minimum
        },
        role: {
            type: String,
            required: [true, 'User role is required.'],
            enum: { // Only allow specific roles
                values: ['student', 'professional'],
                message: '{VALUE} is not a supported role.'
            }
        }
        // Add any other common fields needed for BOTH students and professionals here, if any.
    }, {
        timestamps: true // Adds createdAt and updatedAt automatically
    });

    // Pre-save hook for password hashing should ideally be done in the route for clarity,
    // unless you have multiple ways users are created/updated.

    module.exports = mongoose.model('User', UserSchema); // Will interact with the 'users' collection