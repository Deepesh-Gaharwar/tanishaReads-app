
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  isbn: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  pages: {
    type: Number,
    min: 1
  },
  language: {
    type: String,
    default: 'English'
  },
  price: {
    type: Number,
    min: 0
  },
  coverImage: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  },
  pdfFile: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    },
    filename: String,
    size: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
  type: String,
  enum: ['draft', 'published', 'archived'],
  default: 'published'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
bookSchema.index({ title: 'text', description: 'text', author: 'text', tags: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ publishedDate: -1 });
bookSchema.index({ status: 1 });

module.exports = mongoose.model('Book', bookSchema);
