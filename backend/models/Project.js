const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  // Business-oriented explanation for enterprise demos
  businessDescription: {
    type: String,
    default: ''
  },
  technologies: [{
    type: String,
    trim: true
  }],
  // Project category for filtering
  category: {
    type: String,
    enum: ['ERP', 'CRM', 'Admin', 'Tracking', 'E-Commerce', 'SaaS', 'Other'],
    default: 'Other'
  },
  github: {
    type: String,
    trim: true
  },
  demo: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  // Static image (thumbnail/screenshot)
  image: {
    type: String,
    default: '/project-default.jpg'
  },
  imagePublicId: {
    type: String,
    default: null
  },
  // Video demo support
  hasVideo: {
    type: Boolean,
    default: false
  },
  videoUrl: {
    type: String,
    default: null
  },
  videoPublicId: {
    type: String,
    default: null
  },
  videoThumbnailUrl: {
    type: String,
    default: null
  },
  // Display order
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
projectSchema.index({ category: 1, order: 1 });
projectSchema.index({ featured: 1, hasVideo: 1 });

module.exports = mongoose.model('Project', projectSchema);
