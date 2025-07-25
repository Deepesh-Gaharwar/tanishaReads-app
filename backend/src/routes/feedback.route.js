const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { body, validationResult } = require('express-validator');

// Validation middleware for feedback
const validateFeedback = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// @route   POST /api/feedback
// @desc    Submit user feedback
// @access  Public
router.post('/', 
  validateFeedback,
  handleValidationErrors,
  feedbackController.submitFeedback
);

// @route   GET /api/feedback (Admin only - if you want to fetch feedback)
// @desc    Get all feedback submissions
// @access  Private (Admin)
// router.get('/', authenticateAdmin, feedbackController.getAllFeedback);

module.exports = router;