const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  university: { type: String, required: true },
  studentId: { type: String }, // Optional
  graduationYear: { type: Number }, // Optional
  idCardPhoto: { type: String },  // Path to uploaded file
  verificationToken: { type: String },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('student_user', UserSchema);