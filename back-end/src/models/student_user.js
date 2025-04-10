// back-end/src/models/student_user.js
// *** CORRECTED Schema Name & Made Password Optional ***

const mongoose = require('mongoose');

// Use a descriptive schema name (matches the model/collection name)
const StudentUserSchema = new mongoose.Schema({

    // --- Link to the main User document (Recommended) ---
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' model defined in user.js
        // Consider adding:
        // required: true, // If every student MUST link to a base User record
        // unique: true    // If one User can only link to one StudentUser record
    },

    // --- Student-Specific Details ---
    firstName: {
        type: String,
        required: [true, 'First name is required.'], // Add custom messages
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.'],
        trim: true
    },
    email: { // Keep email here for easier querying of student details if needed
        type: String,
        required: [true, 'Email is required.'],
        unique: true, // Ensure email is unique within the student_users collection too
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    // --- Password (Now Optional) ---
    // We primarily rely on the password in the main 'User' model for authentication.
    // Storing it here is optional and likely redundant if using Option 1.
    password: {
        type: String
        // Removed 'required: true'
    },
    university: {
        type: String,
        required: [true, 'University is required.']
    },
    studentId: { // Often optional
        type: String,
        trim: true
    },
    graduationYear: { // Often optional
        type: String // Store as String if users might type "N/A" etc. Use Number if strict.
    },
    idCardPhotoPath: { // Store the PATH or URL to the saved image file
        type: String,
        required: [true, 'ID card photo path is required.'] // Path should be stored after successful upload
    },

    // --- Verification Fields ---
    isVerified: { // Simplified verification status (matches previous code)
       type: Boolean,
       default: false
    },
    // Removed verificationToken and verificationStatus for consistency with previous route code
    // If you need email verification later, add fields like:
    // verificationToken: String,
    // verificationTokenExpires: Date,
    skills: [String],
pastCompletedSkills: [String],
expertise: {
    type: Number,
    default: 1,
  },
  completionSpeed: {
    type: Number,
    default: 2,
  },
walletBalance: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    required: [true, 'User role is required.'],
    default: 'student'
}
},
 {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Export using the correct model name 'StudentUser' linked to the 'student_users' collection
module.exports = mongoose.model('StudentUser', StudentUserSchema);