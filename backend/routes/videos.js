const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Video = require('../models/Video');

// Cloudinary configuration
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY?.trim();
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

const isCloudinaryConfigured = !!cloudinaryCloudName && !!cloudinaryApiKey && !!cloudinaryApiSecret;

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: cloudinaryCloudName,
        api_key: cloudinaryApiKey,
        api_secret: cloudinaryApiSecret,
    });
}

const router = express.Router();

// Configure multer for video uploads (temporary storage before Cloudinary)
const videoUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for videos
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp4|webm|mov|video\/mp4|video\/webm|video\/quicktime/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype || extname) {
            cb(null, true);
        } else {
            cb(new Error('Only video files (mp4, webm, mov) are allowed'));
        }
    }
});

// Helper function to upload video to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'video',
                folder: 'portfolio_videos',
                ...options
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

// Helper to generate Cloudinary thumbnail URL
const generateThumbnailUrl = (videoUrl, publicId) => {
    if (!publicId) return null;
    // Generate thumbnail at 0 seconds, 640x360, filled
    return cloudinary.url(publicId, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [
            { width: 640, height: 360, crop: 'fill' },
            { start_offset: '0' }
        ]
    });
};

// ================================
// PUBLIC ROUTES
// ================================

// GET /api/videos - Get all videos (public)
router.get('/', async (req, res) => {
    try {
        const { category, featured, limit = 50 } = req.query;

        const query = {};
        if (category && category !== 'all') {
            query.category = category;
        }
        if (featured === 'true') {
            query.featured = true;
        }

        const videos = await Video.find(query)
            .sort({ order: 1, createdAt: -1 })
            .limit(parseInt(limit));

        // Transform for frontend
        const transformedVideos = videos.map(video => ({
            id: video._id,
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl || generateThumbnailUrl(video.videoUrl, video.videoPublicId),
            category: video.category,
            technologies: video.technologies,
            duration: video.duration,
            format: video.format,
            businessDescription: video.businessDescription,
            demoUrl: video.demoUrl,
            githubUrl: video.githubUrl,
            featured: video.featured,
            views: video.views,
            createdAt: video.createdAt
        }));

        res.json(transformedVideos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/videos/:id - Get single video (public)
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        res.json({
            id: video._id,
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl || generateThumbnailUrl(video.videoUrl, video.videoPublicId),
            category: video.category,
            technologies: video.technologies,
            duration: video.duration,
            format: video.format,
            businessDescription: video.businessDescription,
            demoUrl: video.demoUrl,
            githubUrl: video.githubUrl,
            featured: video.featured,
            views: video.views,
            createdAt: video.createdAt
        });
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/videos/:id/view - Increment view count
router.post('/:id/view', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        await video.incrementViews();
        res.json({ success: true, views: video.views });
    } catch (error) {
        console.error('Error incrementing view count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/videos/categories/list - Get unique categories
router.get('/categories/list', async (req, res) => {
    try {
        const categories = await Video.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ================================
// ADMIN ROUTES
// ================================

// POST /api/videos/upload - Upload new video (admin only)
router.post('/upload', authenticateToken, requireAdmin, videoUpload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided' });
        }

        if (!isCloudinaryConfigured) {
            return res.status(503).json({ error: 'Cloudinary is not configured. Video uploads require Cloudinary.' });
        }

        const {
            title,
            description,
            category = 'Other',
            technologies = '',
            businessDescription = '',
            demoUrl = '',
            githubUrl = '',
            featured = false
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        // Upload to Cloudinary
        console.log('📤 Uploading video to Cloudinary...');
        const result = await uploadToCloudinary(req.file.buffer, {
            resource_type: 'video',
            public_id: `video_${Date.now()}_${title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}`,
        });

        console.log('✅ Video uploaded to Cloudinary:', result.secure_url);

        // Generate thumbnail URL
        const thumbnailUrl = generateThumbnailUrl(result.secure_url, result.public_id);

        // Create video document
        const video = new Video({
            title,
            description,
            videoUrl: result.secure_url,
            videoPublicId: result.public_id,
            thumbnailUrl,
            category,
            technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
            duration: result.duration || 0,
            format: result.format || 'mp4',
            businessDescription,
            demoUrl,
            githubUrl,
            featured: featured === 'true' || featured === true
        });

        await video.save();

        res.json({
            success: true,
            video: {
                id: video._id,
                title: video.title,
                description: video.description,
                videoUrl: video.videoUrl,
                thumbnailUrl: video.thumbnailUrl,
                category: video.category,
                technologies: video.technologies,
                duration: video.duration,
                featured: video.featured
            }
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// PUT /api/videos/:id - Update video (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const updateData = req.body;

        // Handle technologies array
        if (updateData.technologies && typeof updateData.technologies === 'string') {
            updateData.technologies = updateData.technologies.split(',').map(t => t.trim());
        }

        // Handle featured boolean
        if (typeof updateData.featured !== 'undefined') {
            updateData.featured = updateData.featured === 'true' || updateData.featured === true;
        }

        Object.assign(video, updateData);
        await video.save();

        res.json({
            success: true,
            video: {
                id: video._id,
                title: video.title,
                description: video.description,
                videoUrl: video.videoUrl,
                thumbnailUrl: video.thumbnailUrl,
                category: video.category,
                technologies: video.technologies,
                duration: video.duration,
                featured: video.featured
            }
        });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/videos/:id - Delete video (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Delete from Cloudinary
        if (video.videoPublicId && isCloudinaryConfigured) {
            try {
                await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: 'video' });
                console.log('🗑️ Deleted video from Cloudinary:', video.videoPublicId);
            } catch (cleanupError) {
                console.error('Failed to delete video from Cloudinary:', cleanupError);
            }
        }

        // Delete from database
        await Video.findByIdAndDelete(req.params.id);

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/videos/:id/reorder - Update video order (admin only)
router.put('/:id/reorder', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { order } = req.body;
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { order },
            { new: true }
        );

        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        res.json({ success: true, video });
    } catch (error) {
        console.error('Error reordering video:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
