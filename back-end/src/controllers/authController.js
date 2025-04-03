// controllers/authController.js
const StudentUser = require('../models/student_user'); // Correctly imported
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config({ path: '../.env' });

const registerUser = async (req, res) => {
  console.log('--- Register User Request Received ---');
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);

  try {
    const { firstName, lastName, email, password, university, studentId, graduationYear } = req.body;

    if (!req.file) {
      console.error("File not uploaded or Multer error occurred before controller.");
      return res.status(400).json({ message: 'ID card photo is required and must be a valid image.' });
    }

    // *** FIX: Use StudentUser here ***
    let user = await StudentUser.findOne({ email });
    if (user) {
      console.log('User already exists, sending 400');
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    console.log('User does not exist, proceeding...');

    const verificationToken = crypto.randomBytes(20).toString('hex');
    console.log('Generated verification token');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed');

    // *** FIX: Use StudentUser here ***
    user = new StudentUser({
      firstName, lastName, email, password: hashedPassword, university,
      studentId: studentId || null,
      graduationYear: graduationYear || null,
      idCardPhoto: req.file.path,
      verificationToken,
    });
    console.log('New user object created:', user);

    await user.save();
    console.log('User saved to database');

    // --- Send Verification Email ---
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Email credentials not found in .env file. Cannot send verification email.");
        return res.status(201).json({ message: 'Registration successful, but could not send verification email (server config issue).' });
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;
    console.log("Verification Link:", verificationLink);

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Student Account',
      html: `<p>Thank you for registering!</p><p>Please click the following link to verify your email address:</p><a href="${verificationLink}">Verify Email Address</a><p>If you didn't register for this account, please ignore this email.</p>`,
      text: `Thank you for registering! Please visit the following link to verify your email address: ${verificationLink}`
    };

    console.log('Attempting to send verification email to:', email);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('!!! Email Sending Error:', error);
        res.status(201).json({ message: 'Registration successful, but failed to send verification email. Please contact support.' });
      } else {
        console.log('Verification email sent successfully:', info.response);
        res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
      }
    });

  } catch (err) {
    console.error('!!! SERVER ERROR in registerUser:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const verifyEmail = async (req, res) => {
    console.log('--- Verify Email Request Received ---');
    console.log('Token:', req.params.token);
    try {
        const { token } = req.params;

        if (!token) {
             return res.status(400).send('Verification token missing.');
        }

        // *** FIX: Use StudentUser here ***
        const user = await StudentUser.findOne({ verificationToken: token });

        if (!user) {
            console.log('Invalid or expired token:', token);
            return res.status(400).send('Invalid or expired verification link. Please register again or request a new link.');
        }

        if (user.verificationStatus === 'verified') {
            console.log('User already verified:', user.email);
             return res.redirect(`${process.env.FRONT_END_URL}/verification-success?message=already-verified`);
        }

        user.verificationStatus = 'verified';
        user.verificationToken = undefined;
        await user.save();
        console.log('User email verified successfully:', user.email);

        res.redirect(`${process.env.FRONT_END_URL}/verification-success`);

    } catch (err) {
        console.error('!!! SERVER ERROR during email verification:', err);
        res.status(500).send('Server error during email verification. Please try again later.');
    }
};


module.exports = { registerUser, verifyEmail };