const express = require('express');
const router = express.Router();

// Import controllers and middleware
const authController = require('../controllers/auth.controller');
const { authenticateAdmin } = require('../middlewares/auth.middleware');
const { uploadProfileImage, handleUploadError } = require('../middlewares/fileUpload.middleware');
const {
  validateAdminRegistration,
  validateAdminLogin,
  validateProfileUpdate,
  validatePasswordChange
} = require('../middlewares/validation.middleware');

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @route   POST /api/auth/register
// @desc    Register a new admin
// @access  Public (you might want to restrict this in production)
router.post('/register', validateAdminRegistration, asyncHandler(authController.register));

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public
router.post('/login', validateAdminLogin, asyncHandler(authController.login));

// @route   GET /api/auth/profile
// @desc    Get current admin profile
// @access  Private
router.get('/profile', authenticateAdmin, asyncHandler(authController.getProfile));

// @route   PUT /api/auth/profile
// @desc    Update admin profile
// @access  Private
router.put('/profile', authenticateAdmin, validateProfileUpdate, asyncHandler(authController.updateProfile));

// @route   POST /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.post('/change-password', authenticateAdmin, validatePasswordChange, asyncHandler(authController.changePassword));

// @route   POST /api/auth/upload-profile-image
// @desc    Upload admin profile image
// @access  Private
router.post('/upload-profile-image',
  authenticateAdmin,
  uploadProfileImage,
  handleUploadError,
  asyncHandler(async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Update admin profile with new image
      const Admin = require('../models/admin.model'); // ✅ Fixed path
      const { cloudinary } = require('../middlewares/fileUpload.middleware'); // ✅ Fixed path

      const admin = await Admin.findById(req.admin._id);
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      // Delete old profile image if exists
      if (admin.profileImage && admin.profileImage.public_id) {
        try {
          await cloudinary.uploader.destroy(admin.profileImage.public_id);
        } catch (deleteError) {
          console.warn('Failed to delete old profile image:', deleteError);
          // Continue with upload even if delete fails
        }
      }

      // Update with new image
      admin.profileImage = {
        url: req.file.path,
        public_id: req.file.filename
      };

      await admin.save();

      res.status(200).json({
        success: true,
        message: 'Profile image updated successfully',
        data: {
          profileImage: admin.profileImage
        }
      });

    } catch (error) {
      console.error('Upload profile image error:', error);
      
      // If upload succeeded but saving failed, try to clean up
      if (req.file && req.file.filename) {
        try {
          const { cloudinary } = require('../middlewares/fileUpload.middleware');
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (cleanupError) {
          console.warn('Failed to cleanup uploaded file:', cleanupError);
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Server error while uploading image'
      });
    }
  })
);

// @route   DELETE /api/auth/profile-image
// @desc    Delete admin profile image
// @access  Private
router.delete('/profile-image', authenticateAdmin, asyncHandler(async (req, res) => {
  try {
    const Admin = require('../models/admin.model'); // ✅ Fixed path
    const { cloudinary } = require('../middlewares/fileUpload.middleware'); // ✅ Fixed path

    const admin = await Admin.findById(req.admin._id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (!admin.profileImage || !admin.profileImage.public_id) {
      return res.status(400).json({
        success: false,
        message: 'No profile image found'
      });
    }

    try {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(admin.profileImage.public_id);
    } catch (deleteError) {
      console.warn('Failed to delete image from Cloudinary:', deleteError);
      // Continue with database cleanup even if Cloudinary delete fails
    }

    // Remove from database
    admin.profileImage = undefined;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Profile image deleted successfully'
    });

  } catch (error) {
    console.error('Delete profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting image'
    });
  }
}));

// @route   POST /api/auth/logout
// @desc    Logout admin (optional - for token blacklisting if implemented)
// @access  Private
router.post('/logout', authenticateAdmin, asyncHandler(async (req, res) => {
  try {
    // If you implement token blacklisting, add the logic here
    // For now, just return success since JWT is stateless
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
}));

// Global error handler for auth routes
router.use((error, req, res, next) => {
  console.error('Auth routes error:', error);
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = router;