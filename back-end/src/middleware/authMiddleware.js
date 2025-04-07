const jwt = require('jsonwebtoken');
require('dotenv').config(); // Make sure JWT_SECRET is accessible

module.exports = function(req, res, next) {
    // Get token from header (Commonly 'Authorization': 'Bearer TOKEN')
    const authHeader = req.header('Authorization');

    // Check if no token in header
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header, access denied' });
    }

    // Split 'Bearer TOKEN'
    const tokenParts = authHeader.split(' ');

    // Check if format is correct ('Bearer' prefix and token)
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
         console.warn("Invalid Authorization header format:", authHeader); // Log for debugging
         return res.status(401).json({ message: 'Token format is invalid (Must be "Bearer <token>")' });
    }

    const token = tokenParts[1]; // Extract the actual token part

    // Check if token exists after split
    if (!token) {
        console.warn("Token missing after splitting header:", authHeader); // Log for debugging
         return res.status(401).json({ message: 'No token found after "Bearer", access denied' });
    }


    // Verify token
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('FATAL AUTH ERROR: JWT_SECRET is not defined in environment variables.');
            return res.status(500).json({ message: 'Server configuration error (Auth Secret).' });
        }

        const decoded = jwt.verify(token, jwtSecret);

        // Add user from payload to the request object
        // Ensure your JWT payload during login includes { user: { id: '...', role: '...' } }
        if (!decoded.user || !decoded.user.id) {
             console.error("Token payload is missing user ID after decoding:", decoded);
             return res.status(401).json({ message: 'Token is invalid (missing user data)' });
        }

        req.user = decoded.user; // Attach user info (like { id: '...', role: '...' })
        console.log(`Auth Middleware: Token verified for user ID ${req.user.id}`); // Log success
        next(); // Move to the next middleware or route handler

    } catch (err) {
        // Handle specific JWT errors
        if (err.name === 'TokenExpiredError') {
             console.warn('Auth Middleware: Token expired.');
             return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }
         if (err.name === 'JsonWebTokenError') {
             console.warn('Auth Middleware: Invalid token signature or format.', err.message);
             return res.status(401).json({ message: 'Token is not valid.' });
        }
        // Handle other potential errors during verification
        console.error('Auth Middleware: Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid.' });
    }
};