
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage configuration for cover images
const coverImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'book-covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 1200, crop: 'limit', quality: 'auto' }
    ]
  }
});

// Storage configuration for PDF files
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'book-pdfs',
    allowed_formats: ['pdf'],
    resource_type: 'auto'
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverImage') {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Cover image must be an image file (jpg, jpeg, png, webp)'), false);
    }
  } else if (file.fieldname === 'pdfFile') {
    // Check if file is a PDF
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Book file must be a PDF'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Create multer upload middleware
const upload = multer({
  storage: multer.memoryStorage(), // We'll handle storage per field
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 2 // Maximum 2 files (cover image + PDF)
  }
});

// Custom middleware to handle different storage for different fields
const handleFileUploads = (req, res, next) => {
  const uploadFields = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
  ]);

  uploadFields(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 50MB.'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum 2 files allowed.'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: 'Unexpected file field.'
          });
        }
      }
      
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }

    // If no files uploaded, continue
    if (!req.files) {
      return next();
    }

    try {
      // Upload cover image to Cloudinary
      if (req.files.coverImage) {
        const coverImageResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type :'auto',
              folder: 'book-covers',
              allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
              transformation: [
                { width: 800, height: 1200, crop: 'limit', quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.files.coverImage[0].buffer);
        });

        req.files.coverImage[0].path = coverImageResult.secure_url;
        req.files.coverImage[0].filename = coverImageResult.public_id;
      }

      // Upload PDF to Cloudinary
      if (req.files.pdfFile) {
        const pdfResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'book-pdfs',
              resource_type: 'auto',
              allowed_formats: ['pdf']
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.files.pdfFile[0].buffer);
        });

        req.files.pdfFile[0].path = pdfResult.secure_url;
        req.files.pdfFile[0].filename = pdfResult.public_id;
        req.files.pdfFile[0].bytes = pdfResult.bytes;
      }

      next();
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      res.status(500).json({
        success: false,
        message: 'Error uploading files to cloud storage'
      });
    }
  });
};

// Profile image upload middleware (for admin profile)
const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'admin-profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }
    ]
  }
});

const uploadProfileImage = multer({
  storage: profileImageStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Profile image must be an image file'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for profile images
  }
}).single('profileImage');

// Error handling middleware for file uploads
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large.'
      });
    }
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }
  
  next();
};

module.exports = {
  handleFileUploads,
  uploadProfileImage,
  handleUploadError,
  cloudinary
};
