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
  technologies: [{
    type: String,
    trim: true
  }],
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
  image: {
    type: String,
    default: '/project-default.jpg'
  },
  cloudinaryPublicId: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
