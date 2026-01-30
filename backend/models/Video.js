const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    // Cloudinary video URL
    videoUrl: {
        type: String,
        required: true
    },
    // Cloudinary public ID for video management
    videoPublicId: {
        type: String,
        required: true
    },
    // Auto-generated thumbnail from Cloudinary
    thumbnailUrl: {
        type: String,
        default: null
    },
    // Project category for filtering
    category: {
        type: String,
        enum: ['ERP', 'CRM', 'Admin', 'Tracking', 'E-Commerce', 'SaaS', 'Other'],
        default: 'Other'
    },
    // Tech stack used in the project
    technologies: [{
        type: String,
        trim: true
    }],
    // Duration in seconds (can be extracted from Cloudinary metadata)
    duration: {
        type: Number,
        default: 0
    },
    // Video format
    format: {
        type: String,
        enum: ['mp4', 'webm', 'mov'],
        default: 'mp4'
    },
    // Business explanation for enterprise demos
    businessDescription: {
        type: String,
        default: ''
    },
    // Link to live demo (if available)
    demoUrl: {
        type: String,
        trim: true,
        default: ''
    },
    // Link to GitHub repository
    githubUrl: {
        type: String,
        trim: true,
        default: ''
    },
    // Is this a featured video?
    featured: {
        type: Boolean,
        default: false
    },
    // View count for analytics
    views: {
        type: Number,
        default: 0
    },
    // Display order
    order: {
        type: Number,
        default: 0
    },
    // Related project ID (optional link to Project model)
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient queries
videoSchema.index({ category: 1, order: 1 });
videoSchema.index({ featured: 1, createdAt: -1 });

// Virtual for generating Cloudinary thumbnail URL
videoSchema.virtual('autoThumbnail').get(function () {
    if (this.thumbnailUrl) return this.thumbnailUrl;
    if (this.videoUrl && this.videoPublicId) {
        // Generate thumbnail from Cloudinary video
        const baseUrl = this.videoUrl.replace('/video/upload/', '/video/upload/so_0,w_640,h_360,c_fill/');
        return baseUrl.replace(/\.(mp4|webm|mov)$/, '.jpg');
    }
    return null;
});

// Method to increment view count
videoSchema.methods.incrementViews = async function () {
    this.views += 1;
    return this.save();
};

module.exports = mongoose.model('Video', videoSchema);
