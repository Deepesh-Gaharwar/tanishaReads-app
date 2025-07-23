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

// @route   POST /api/auth/register
// @desc    Register a new admin
// @access  Public (you might want to restrict this in production)
router.post('/register', validateAdminRegistration, authController.register);

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public
router.post('/login', validateAdminLogin, authController.login);

// @route   GET /api/auth/profile
// @desc    Get current admin profile
// @access  Private
router.get('/profile', authenticateAdmin, authController.getProfile);

// @route   PUT /api/auth/profile
// @desc    Update admin profile
// @access  Private
router.put('/profile', authenticateAdmin, validateProfileUpdate, authController.updateProfile);

// @route   POST /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.post('/change-password', authenticateAdmin, validatePasswordChange, authController.changePassword);

// @route   POST /api/auth/upload-profile-image
// @desc    Upload admin profile image
// @access  Private
router.post('/upload-profile-image', 
  authenticateAdmin, 
  uploadProfileImage, 
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Update admin profile with new image
      const Admin = require('../models/admin.model');
      const { cloudinary } = require('../middlewares/fileUpload.middleware');

      const admin = await Admin.findById(req.admin._id);

      // Delete old profile image if exists
      if (admin.profileImage && admin.profileImage.public_id) {
        await cloudinary.uploader.destroy(admin.profileImage.public_id);
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
      res.status(500).json({
        success: false,
        message: 'Server error while uploading image'
      });
    }
  }
);

// @route   DELETE /api/auth/profile-image
// @desc    Delete admin profile image
// @access  Private
router.delete('/profile-image', authenticateAdmin, async (req, res) => {
  try {
    const Admin = require('../models/Admin');
    const { cloudinary } = require('../middleware/upload');

    const admin = await Admin.findById(req.admin._id);

    if (!admin.profileImage || !admin.profileImage.public_id) {
      return res.status(400).json({
        success: false,
        message: 'No profile image found'
      });
    }

    // Delete image from cloudinary
    await cloudinary.uploader.destroy(admin.profileImage.public_id);

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
});

module.exports = router;