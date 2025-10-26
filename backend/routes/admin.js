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

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const router = express.Router();

// Configure multer with the new storage system
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// In-memory data storage (in production, use a database)
let portfolioData = {
  profile: {
    name: 'John Doe',
    title: 'Full-Stack Developer & UI/UX Designer',
    bio: 'Passionate about creating beautiful, functional, and user-centered digital experiences. I specialize in modern web technologies and love turning complex problems into simple, elegant solutions.',
    email: 'john@example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    profileImage: '/profile.jpg'
  },
  projects: [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution built with Next.js, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true,
      image: '/project1.jpg'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      technologies: ['React', 'Express', 'Socket.io', 'PostgreSQL'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true,
      image: '/project2.jpg'
    }
  ],
  skills: [
    'React/Next.js',
    'Node.js/Express',
    'TypeScript',
    'Tailwind CSS',
    'MongoDB',
    'PostgreSQL',
    'AWS',
    'Docker'
  ]
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user in database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all portfolio data
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
        bio: 'Passionate about creating beautiful, functional, and user-centered digital experiences.',
        email: 'john@example.com',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        profileImage: '/profile.jpg'
      },
      projects: projects || [],
      skills: skills.map(skill => skill.name) || []
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
router.put('/portfolio/profile', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    if (profile) {
      // Update existing profile
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      // Create new profile
      profile = new Profile(req.body);
      await profile.save();
    }
    
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload profile image
router.post('/portfolio/profile/image', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Update profile in database
    let profile = await Profile.findOne();
    if (profile) {
      profile.profileImage = imageUrl;
      await profile.save();
    } else {
      profile = new Profile({ profileImage: imageUrl });
      await profile.save();
    }
    
    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all projects
router.get('/portfolio/projects', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    // Transform MongoDB _id to id for frontend compatibility
    const transformedProjects = projects.map(project => ({
      ...project.toObject(),
      id: project._id
    }));
    res.json(transformedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new project
router.post('/portfolio/projects', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const projectData = req.body;
    
    const newProject = new Project({
      ...projectData,
      technologies: projectData.technologies ? projectData.technologies.split(',').map(t => t.trim()) : [],
      featured: projectData.featured === 'true',
      image: req.file ? `/uploads/${req.file.filename}` : '/project-default.jpg'
    });
    
    await newProject.save();
    // Transform MongoDB _id to id for frontend compatibility
    const transformedProject = {
      ...newProject.toObject(),
      id: newProject._id
    };
    res.json({ success: true, project: transformedProject });
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
router.put('/portfolio/projects/:id', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const updateData = req.body;
    if (updateData.technologies) {
      updateData.technologies = updateData.technologies.split(',').map(t => t.trim());
    }
    if (updateData.featured) {
      updateData.featured = updateData.featured === 'true';
    }
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    Object.assign(project, updateData);
    await project.save();
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedProject = {
      ...project.toObject(),
      id: project._id
    };
    res.json({ success: true, project: transformedProject });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project
router.delete('/portfolio/projects/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByIdAndDelete(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update skills
router.put('/portfolio/skills', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { skills } = req.body;
    
    // Clear existing skills
    await Skill.deleteMany({});
    
    // Add new skills
    const skillPromises = skills.map((skillName, index) => 
      new Skill({ name: skillName, order: index }).save()
    );
    
    await Promise.all(skillPromises);
    
    res.json({ success: true, skills });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contact messages
router.get('/messages', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Save visualization endpoint
router.post('/visualization/save', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { visualizationId, reportType } = req.body;
    
    if (!visualizationId || !reportType) {
      return res.status(400).json({ error: 'Missing visualizationId or reportType' });
    }

    // Generate unique filename for the visualization
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${reportType}_${visualizationId}_${Date.now()}${fileExtension}`;
    
    // Move file to reports directory
    const reportsDir = path.join(__dirname, '../../frontend/public/reports');
    const finalPath = path.join(reportsDir, filename);
    
    // Ensure reports directory exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    // Move file from temp location to final location
    fs.renameSync(req.file.path, finalPath);
    
    // Return the public URL
    const imageUrl = `/reports/${filename}`;
    
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      message: 'Visualization saved successfully' 
    });
    
  } catch (error) {
    console.error('Error saving visualization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
