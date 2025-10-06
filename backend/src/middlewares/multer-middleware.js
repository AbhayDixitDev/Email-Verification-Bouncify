const multer = require('multer');
const path = require('path');

//  Middleware function to handle errors from Multer (file upload middleware)
const handleMulterError = (err, req, res, next) => {
  if (err) {
    Logs.error('Multer error:', err);
    return res.status(422).json(Response.failed("unable to upload file", res))
  }
  next();
}

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    
    if (path.extname(file.originalname).toLowerCase() !== '.csv') {
      return cb(new Error('Only CSV files are allowed'));
    }

    // Validate MIME type (allow common csv types)
    const allowedMime = ['text/csv', 'application/vnd.ms-excel', 'application/csv'];
    if (!allowedMime.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  }
});

module.exports = { upload, handleMulterError }