const express = require('express');
const router = express.Router();

// Import controllers and middleware
const bookController = require('../controllers/book.controller');
const { authenticateAdmin, optionalAuth } = require('../middlewares/auth.middleware');
const { handleFileUploads, handleUploadError } = require('../middlewares/fileUpload.middleware');
const {
  validateBookCreation,
  validateBookUpdate,
  validateObjectId,
  validateQueryParams
} = require('../middlewares/validation.middleware');

// @route   GET /api/books
router.get('/', optionalAuth, validateQueryParams, bookController.getAllBooks);

// @route   GET /api/books/stats
router.get('/stats', authenticateAdmin, bookController.getBooksStats);

// @route   GET /api/books/:id
router.get('/:id', optionalAuth, validateObjectId('id'), bookController.getBookById);

// @route   POST /api/books
router.post('/',
  authenticateAdmin,
  handleFileUploads,
  handleUploadError,
  validateBookCreation,
  bookController.createBook
);

// 🔀 Moved these two above the general /:id route to avoid conflict

// @route   PUT /api/books/:id/toggle-visibility
router.put('/:id/toggle-visibility',
  authenticateAdmin,
  validateObjectId('id'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const Book = require('../models/book.model');

      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      // Toggle visibility
      book.isPublic = !book.isPublic;
      await book.save();

      res.status(200).json({
        success: true,
        message: `Book ${book.isPublic ? 'made public' : 'made private'}`,
        data: { book }
      });

    } catch (error) {
      console.error('Toggle visibility error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while toggling visibility'
      });
    }
  }
);

// @route   PUT /api/books/:id/status
router.put('/:id/status',
  authenticateAdmin,
  validateObjectId('id'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['draft', 'published', 'archived'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be draft, published, or archived'
        });
      }

      const Book = require('../models/book.model');

      const book = await Book.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      ).populate('createdBy', 'name username');

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      res.status(200).json({
        success: true,
        message: `Book status updated to ${status}`,
        data: { book }
      });

    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating status'
      });
    }
  }
);

// @route   PUT /api/books/:id
router.put('/:id',
  authenticateAdmin,
  validateObjectId('id'),
  handleFileUploads,
  handleUploadError,
  validateBookUpdate,
  bookController.updateBook
);

// @route   DELETE /api/books/:id
router.delete('/:id',
  authenticateAdmin,
  validateObjectId('id'),
  bookController.deleteBook
);

// @route   GET /api/books/:id/download
router.get('/:id/download',
  optionalAuth,
  validateObjectId('id'),
  bookController.downloadPDF
);

// @route   GET /api/books/search/:query
router.get('/search/:query', optionalAuth, async (req, res) => {
  try {
    const { query } = req.params;
    const {
      page = 1,
      limit = 10,
      genre,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    req.query.search = query;
    bookController.getAllBooks(req, res);
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching books'
    });
  }
});

// @route   GET /api/books/genre/:genre
router.get('/genre/:genre', optionalAuth, validateQueryParams, async (req, res) => {
  try {
    const { genre } = req.params;
    req.query.genre = genre;
    bookController.getAllBooks(req, res);
  } catch (error) {
    console.error('Get books by genre error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books by genre'
    });
  }
});

// @route   GET /api/books/author/:author
router.get('/author/:author', optionalAuth, validateQueryParams, async (req, res) => {
  try {
    const { author } = req.params;
    req.query.search = author;
    bookController.getAllBooks(req, res);
  } catch (error) {
    console.error('Get books by author error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books by author'
    });
  }
});

module.exports = router;
