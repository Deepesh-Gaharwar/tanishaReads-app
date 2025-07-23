const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const Book = require('../models/book.model');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Check if files are uploaded
    if (!req.files || !req.files.coverImage || !req.files.pdfFile) {
      return res.status(400).json({
        success: false,
        message: 'Both cover image and PDF file are required'
      });
    }

    const {
      title,
      description,
      author,
      genre,
      isbn,
      pages,
      language,
      price,
      tags,
      status,
      isPublic
    } = req.body;

    // Parse tags if it's a string
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    }

    // Create book object
    const bookData = {
      title,
      description,
      author,
      genre,
      isbn,
      pages: pages ? parseInt(pages) : undefined,
      language: language || 'English',
      price: price ? parseFloat(price) : undefined,
      tags: parsedTags,
      status: status || 'published',
      isPublic: isPublic !== undefined ? isPublic === 'true' : true,
      coverImage: {
        url: req.files.coverImage[0].path,
        public_id: req.files.coverImage[0].filename
      },
      pdfFile: {
        url: req.files.pdfFile[0].path,
        public_id: req.files.pdfFile[0].filename,
        filename: req.files.pdfFile[0].originalname,
        size: req.files.pdfFile[0].bytes
      },
      createdBy: req.admin._id
    };

    const book = new Book(bookData);
    await book.save();

    // Populate the createdBy field
    await book.populate('createdBy', 'name username');

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: { book }
    });

  } catch (error) {
    console.error('Create book error:', error);
    
    // Clean up uploaded files if book creation fails
    if (req.files) {
      if (req.files.coverImage) {
        await cloudinary.uploader.destroy(req.files.coverImage[0].filename);
      }
      if (req.files.pdfFile) {
        await cloudinary.uploader.destroy(req.files.pdfFile[0].filename);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating book'
    });
  }
};

// Get all books (with pagination and filters)
exports.getAllBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      genre,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by genre
    if (genre) {
      query.genre = new RegExp(genre, 'i');
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // For public API, only show public and published books
    if (!req.admin) {
      query.isPublic = true;
      query.status = 'published';
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const books = await Book.find(query)
      .populate('createdBy', 'name username')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBooks,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books'
    });
  }
};

// Get single book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    let query = { _id: id };

    // For public API, only show public and published books
    if (!req.admin) {
      query.isPublic = true;
      query.status = 'published';
    }

    const book = await Book.findOne(query).populate('createdBy', 'name username');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { book }
    });

  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching book'
    });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const {
      title,
      description,
      author,
      genre,
      isbn,
      pages,
      language,
      price,
      tags,
      status,
      isPublic
    } = req.body;

    // Parse tags if provided
    let parsedTags = book.tags;
    if (tags !== undefined) {
      parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    }

    // Update basic fields
    const updateData = {
      title: title || book.title,
      description: description || book.description,
      author: author || book.author,
      genre: genre || book.genre,
      isbn: isbn || book.isbn,
      pages: pages ? parseInt(pages) : book.pages,
      language: language || book.language,
      price: price ? parseFloat(price) : book.price,
      tags: parsedTags,
      status: status || book.status,
      isPublic: isPublic !== undefined ? isPublic === 'true' : book.isPublic
    };

    // Handle file updates
    if (req.files) {
      // Update cover image
      if (req.files.coverImage) {
        // Delete old cover image from cloudinary
        await cloudinary.uploader.destroy(book.coverImage.public_id);
        
        updateData.coverImage = {
          url: req.files.coverImage[0].path,
          public_id: req.files.coverImage[0].filename
        };
      }

      // Update PDF file
      if (req.files.pdfFile) {
        // Delete old PDF from cloudinary
        await cloudinary.uploader.destroy(book.pdfFile.public_id);
        
        updateData.pdfFile = {
          url: req.files.pdfFile[0].path,
          public_id: req.files.pdfFile[0].filename,
          filename: req.files.pdfFile[0].originalname,
          size: req.files.pdfFile[0].bytes
        };
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name username');

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: { book: updatedBook }
    });

  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating book'
    });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Delete files from cloudinary
    await Promise.all([
      cloudinary.uploader.destroy(book.coverImage.public_id),
      cloudinary.uploader.destroy(book.pdfFile.public_id)
    ]);

    // Delete book from database
    await Book.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });

  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting book'
    });
  }
};

// Download PDF (increment download count)
exports.downloadPDF = async (req, res) => {
  try {
    const { id } = req.params;

    let query = { _id: id };

    // For public API, only allow downloading public and published books
    if (!req.admin) {
      query.isPublic = true;
      query.status = 'published';
    }

    const book = await Book.findOne(query);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or not available for download'
      });
    }

    // Increment download count
    await Book.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });

    res.status(200).json({
      success: true,
      data: {
        downloadUrl: book.pdfFile.url,
        filename: book.pdfFile.filename
      }
    });

  } catch (error) {
    console.error('Download PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing download'
    });
  }
};

// Get books statistics (admin only)
exports.getBooksStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const publishedBooks = await Book.countDocuments({ status: 'published' });
    const draftBooks = await Book.countDocuments({ status: 'draft' });
    const archivedBooks = await Book.countDocuments({ status: 'archived' });
    
    const totalDownloads = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);

    const genreStats = await Book.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        publishedBooks,
        draftBooks,
        archivedBooks,
        totalDownloads: totalDownloads[0]?.total || 0,
        genreStats
      }
    });

  } catch (error) {
    console.error('Get books stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};