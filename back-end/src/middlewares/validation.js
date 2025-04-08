// middleware/validation.js
const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('lastName').trim().notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  // No need to validate confirmPassword on the backend, it's a frontend check
  body('university').trim().notEmpty().withMessage('University is required.'),
  // Optional fields don't need explicit validation unless you have specific format requirements

  // Middleware function to handle validation errors
  (req, res, next) => {
    // Check if a file was uploaded (required by your frontend logic)
    // Note: Multer error handling is done in upload.js now
    // if (!req.file) {
    //     return res.status(400).json({ errors: [{ msg: 'ID card photo is required.' }] });
    // }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation errors exist, return them
      return res.status(400).json({ errors: errors.array() });
    }
    // If no errors, proceed to the next middleware/route handler
    next();
  },
];

module.exports = { validateRegistration };