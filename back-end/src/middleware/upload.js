// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the destination directory
const uploadDir = path.join(__dirname, '../uploads'); // Go up one level from middleware to src, then into uploads

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
} else {
    console.log(`Directory exists: ${uploadDir}`);
}


// Set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir); // Use the absolute path
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 5 * 1024 * 1024}, // 5MB limit
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('idCardPhoto'); // Expect a single file with the field name 'idCardPhoto'

// Check file type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Images Only (jpeg, jpg, png)!'); // More specific error
    }
}

// Middleware function to handle upload errors gracefully
const handleUpload = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred (e.g., file size limit)
            console.error("Multer Error:", err);
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // An unknown error occurred (e.g., file type filter)
            console.error("File Upload Error:", err);
            return res.status(400).json({ message: err }); // Send the specific filter error message
        }
        // Everything went fine, proceed to next middleware
        next();
    });
};


module.exports = handleUpload; // Export the combined middleware