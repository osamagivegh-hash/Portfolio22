const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { storage, cloudinary, isCloudinaryConfigured } = require('../config/storage');

// Import MongoDB models
const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Message = require('../models/Message');
const Visualization = require('../models/Visualization');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const router = express.Router();

// Configure multer with the unified storage system
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// 🧩 Utility functions
const getUploadedImageInfo = (file) => {
  if (!file) return { imageUrl: null, imagePublicId: null };

  if (isCloudinaryConfigured) {
    try {
      const secureUrl = file.path || file.secure_url;
      const publicId = file.filename || file.public_id || null;
      return { imageUrl: secureUrl, imagePublicId: publicId };
    } catch (error) {
      console.error('Cloudinary error, fallback to local:', error);
      return { imageUrl: file.filename ? `/uploads/${file.filename}` : null, imagePublicId: null };
    }
  }
  return { imageUrl: file.filename ? `/uploads/${file.filename}` : null, imagePublicId: null };
};

const ensureProjectPreviewImage = (projectData) => {
  if (!projectData || !projectData.image || typeof projectData.image !== 'string') return projectData;
  if (projectData.image.endsWith('.html')) {
    const previewCandidate = projectData.image.replace(/_report\.html$/, '_preview.svg');
    return { ...projectData, image: previewCandidate };
  }
  return projectData;
};

// 🔐 Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ success: true, token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🧠 Get all portfolio data
router.get('/portfolio', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [profile, projects, skills] = await Promise.all([
      Profile.findOne().sort({ createdAt: -1 }),
      Project.find().sort({ order: 1, createdAt: -1 }),
      Skill.find().sort({ order: 1, createdAt: -1 })
    ]);

    res.json({
      profile: profile || {
        name: 'John Doe',
        title: 'Full-Stack Developer & UI/UX Designer',
        bio: 'Passionate about creating digital experiences.',
        email: 'john@example.com',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        profileImage: '/profile.jpg'
      },
      projects: projects.map(p => ({ ...ensureProjectPreviewImage(p.toObject()), id: p._id })),
      skills: skills.map(s => s.name) || []
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 👤 Update profile
router.put('/portfolio/profile', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) Object.assign(profile, req.body);
    else profile = new Profile(req.body);
    await profile.save();
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 📸 Upload profile image
router.post('/portfolio/profile/image', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });
    const { imageUrl, imagePublicId } = getUploadedImageInfo(req.file);
    if (!imageUrl) return res.status(409).json({ error: 'Failed to process uploaded image' });

    let profile = await Profile.findOne();
    if (profile) {
      if (profile.profileImagePublicId && imagePublicId && isCloudinaryConfigured && cloudinary) {
        try { await cloudinary.uploader.destroy(profile.profileImagePublicId); } 
        catch (cleanupError) { console.error('Failed to remove old image:', cleanupError); }
      }
      profile.profileImage = imageUrl;
      profile.profileImagePublicId = imagePublicId;
      await profile.save();
    } else {
      profile = new Profile({ profileImage: imageUrl, profileImagePublicId: imagePublicId });
      await profile.save();
    }
    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🧱 Projects CRUD
router.get('/portfolio/projects', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects.map(p => ({ ...ensureProjectPreviewImage(p.toObject()), id: p._id })));
  } catch (error) {
    console.error('Fetch projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/portfolio/projects', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const projectData = req.body;
    const { imageUrl, imagePublicId } = getUploadedImageInfo(req.file);
    const newProject = new Project({
      ...projectData,
      technologies: projectData.technologies ? projectData.technologies.split(',').map(t => t.trim()) : [],
      featured: projectData.featured === 'true',
      image: imageUrl || '/project-default.jpg',
      imagePublicId: imagePublicId || null
    });
    await newProject.save();
    res.json({ success: true, project: { ...ensureProjectPreviewImage(newProject.toObject()), id: newProject._id } });
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/portfolio/projects/:id', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const updateData = req.body;
    if (updateData.technologies) updateData.technologies = updateData.technologies.split(',').map(t => t.trim());
    if (typeof updateData.featured !== 'undefined') updateData.featured = updateData.featured === 'true' || updateData.featured === true;

    if (req.file) {
      const { imageUrl, imagePublicId } = getUploadedImageInfo(req.file);
      updateData.image = imageUrl;
      updateData.imagePublicId = imagePublicId;
      console.log('☁️ Cloudinary image updated:', imageUrl);
    }

    Object.assign(project, updateData);
    await project.save();
    res.json({ success: true, project: { ...ensureProjectPreviewImage(project.toObject()), id: project._id } });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/portfolio/projects/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.imagePublicId && isCloudinaryConfigured && cloudinary) {
      try { await cloudinary.uploader.destroy(project.imagePublicId); } 
      catch (cleanupError) { console.error('Failed to remove project image:', cleanupError); }
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🧠 Skills
router.put('/portfolio/skills', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { skills } = req.body;
    await Skill.deleteMany({});
    const skillPromises = skills.map((name, index) => new Skill({ name, order: index }).save());
    await Promise.all(skillPromises);
    res.json({ success: true, skills });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 💬 Messages
router.get('/messages', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🧾 Token verification
router.get('/verify', authenticateToken, (req, res) => res.json({ valid: true, user: req.user }));

// 📊 Get analytics visualizations from MongoDB
router.get('/analytics/visualizations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const visualizations = await Visualization.find().sort({ createdAt: -1 });
    
    // Transform MongoDB documents to match frontend expectations
    const transformedVisualizations = visualizations.map(viz => ({
      id: viz.visualizationId, // Use visualizationId as the id field
      visualizationId: viz.visualizationId,
      reportType: viz.reportType,
      imageUrl: viz.imageUrl,
      imagePublicId: viz.imagePublicId,
      createdAt: viz.createdAt
    }));
    
    res.json(transformedVisualizations);
  } catch (error) {
    console.error('Error fetching visualizations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 📈 Save visualization (Cloudinary + MongoDB)
router.post('/visualization/save', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });
    const { visualizationId, reportType } = req.body;
    if (!visualizationId || !reportType) return res.status(400).json({ error: 'Missing visualizationId or reportType' });

    let imageUrl, imagePublicId;

    // ☁️ Cloudinary mode
    if (isCloudinaryConfigured && req.file && req.file.path?.startsWith('http')) {
      imageUrl = req.file.path || req.file.secure_url;
      imagePublicId = req.file.filename || req.file.public_id || null;
      console.log('☁️ Visualization uploaded to Cloudinary:', imageUrl);
    } else {
      // 💾 Local fallback (dev only)
      const fileExtension = path.extname(req.file.originalname);
      const filename = `${reportType}_${visualizationId}_${Date.now()}${fileExtension}`;
      const reportsDir = path.join(__dirname, '../../frontend/public/reports');
      if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
      fs.renameSync(req.file.path, path.join(reportsDir, filename));
      imageUrl = `/reports/${filename}`;
      imagePublicId = null;
      console.log('🗂 Visualization saved locally:', imageUrl);
    }

    // 💾 Save to MongoDB
    const visualization = new Visualization({
      visualizationId,
      reportType,
      imageUrl,
      imagePublicId
    });
    
    await visualization.save();
    console.log('✅ Visualization saved to DB and Cloudinary:', imageUrl);
    
    res.json({ 
      success: true, 
      imageUrl, 
      imagePublicId, 
      message: isCloudinaryConfigured ? 'Visualization uploaded to Cloudinary and saved to DB' : 'Visualization saved locally and to DB'
    });
  } catch (error) {
    console.error('Error saving visualization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
