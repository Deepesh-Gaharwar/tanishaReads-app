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

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @route   GET /api/books/stats
// @desc    Get books statistics
// @access  Private (Admin)
router.get('/stats', authenticateAdmin, asyncHandler(bookController.getBooksStats));

// @route   GET /api/books/search/:query
// @desc    Search books by query
// @access  Public
router.get('/search/:query', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Sanitize the query
    const sanitizedQuery = query.trim().substring(0, 100); // Limit query length
    
    const {
      page = 1,
      limit = 10,
      genre,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    req.query.search = sanitizedQuery;
    await bookController.getAllBooks(req, res);
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching books'
    });
  }
}));

// @route   GET /api/books/genre/:genre
// @desc    Get books by genre
// @access  Public
router.get('/genre/:genre', optionalAuth, validateQueryParams, asyncHandler(async (req, res) => {
  try {
    const { genre } = req.params;
    
    if (!genre || genre.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Genre parameter is required'
      });
    }

    // Sanitize genre
    const sanitizedGenre = genre.trim().substring(0, 50);
    req.query.genre = sanitizedGenre;
    
    await bookController.getAllBooks(req, res);
  } catch (error) {
    console.error('Get books by genre error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books by genre'
    });
  }
}));


router.get("/genres", authenticateAdmin, bookController.getAllGenres);


// @route   GET /api/books/author/:author
// @desc    Get books by author
// @access  Public
router.get('/author/:author', optionalAuth, validateQueryParams, asyncHandler(async (req, res) => {
  try {
    const { author } = req.params;
    
    if (!author || author.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Author parameter is required'
      });
    }

    // Sanitize author
    const sanitizedAuthor = author.trim().substring(0, 100);
    req.query.search = sanitizedAuthor;
    
    await bookController.getAllBooks(req, res);
  } catch (error) {
    console.error('Get books by author error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books by author'
    });
  }
}));

// @route   GET /api/books/:id/download
// @desc    Download book PDF
// @access  Public/Private
router.get('/:id/download',
  validateObjectId('id'),
  asyncHandler(bookController.downloadPDF)
);

// @route   PUT /api/books/:id/toggle-visibility
// @desc    Toggle book visibility (public/private)
// @access  Private (Admin)
router.put('/:id/toggle-visibility',
  authenticateAdmin,
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
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
  })
);

// @route   PUT /api/books/:id/status
// @desc    Update book status
// @access  Private (Admin)
router.put('/:id/status',
  authenticateAdmin,
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['draft', 'published', 'archived'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${validStatuses.join(', ')}`
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
  })
);

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public/Private
router.get('/:id', optionalAuth, validateObjectId('id'), asyncHandler(bookController.getBookById));

// @route   GET /api/books
// @desc    Get all books with pagination and filters
// @access  Public/Private
router.get('/', optionalAuth, validateQueryParams, asyncHandler(bookController.getAllBooks));

// @route   POST /api/books
// @desc    Create new book
// @access  Private (Admin)
router.post('/',
  authenticateAdmin,
  handleFileUploads,
  handleUploadError,
  validateBookCreation,
  asyncHandler(bookController.createBook)
);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private (Admin)
router.put('/:id',
  authenticateAdmin,
  validateObjectId('id'),
  handleFileUploads,
  handleUploadError,
  validateBookUpdate,
  asyncHandler(bookController.updateBook)
);

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private (Admin)
router.delete('/:id',
  authenticateAdmin,
  validateObjectId('id'),
  asyncHandler(bookController.deleteBook)
);

// Global error handler for this router
router.use((error, req, res, next) => {
  console.error('Book routes error:', error);
  
  // Handle specific error types
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = router;