const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');

// @route   POST /api/feedback
// @desc    Submit user feedback
// @access  Public
router.post('/', feedbackController.submitFeedback);

module.exports = router;
