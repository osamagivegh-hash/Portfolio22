const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import admin routes
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Diagnostic middleware to log all incoming API requests
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.path}`);
  next();
});

// Frontend path for static file serving
const frontendPath = path.join(__dirname, '../frontend/out');

// Utility function to normalize project media
const normalizeProjectMedia = (projectData) => {
  if (!projectData || typeof projectData !== 'object') {
    return projectData;
  }
  if (projectData.image && typeof projectData.image === 'string' && projectData.image.endsWith('.html')) {
    projectData = {
      ...projectData,
      image: projectData.image.replace(/_report\.html$/, '_preview.svg')
    };
  }
  return projectData;
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for static file serving
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : true, // Disable CORS in production since we serve from same domain
  credentials: true
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files from frontend/public/uploads (preserved across deployments)
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));

// Serve frontend public files (for reports and other static assets)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is working correctly" });
});

app.get('/api/health', (req, res) => {
  const frontendExists = fs.existsSync(frontendPath);
  const indexPath = path.join(frontendPath, 'index.html');
  const indexExists = fs.existsSync(indexPath);
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    frontend: {
      path: frontendPath,
      exists: frontendExists,
      indexExists: indexExists
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Public portfolio data endpoint (no auth required)
app.get('/api/portfolio', async (req, res) => {
  try {
    // Import MongoDB models
    const Profile = require('./models/Profile');
    const Project = require('./models/Project');
    const Skill = require('./models/Skill');

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
      projects: projects ? projects.map(project => ({
        ...normalizeProjectMedia(project.toObject()),
        id: project._id
      })) : [],
      skills: skills.map(skill => skill.name) || []
    });
  } catch (error) {
    console.error('Error fetching public portfolio data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug routes endpoint to list all available routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(m => {
    if (m.route) {
      const methods = Object.keys(m.route.methods).join(',').toUpperCase();
      routes.push(`${methods} ${m.route.path}`);
    }
  });
  res.json({ routes });
});

// Storage status (for quick runtime checks)
app.get('/api/storage/status', (req, res) => {
  try {
    const { isCloudinaryConfigured } = require('./config/storage');
    res.json({
      storage: isCloudinaryConfigured ? 'cloudinary' : 'local',
      cloud_name: isCloudinaryConfigured ? process.env.CLOUDINARY_CLOUD_NAME : null
    });
  } catch (e) {
    res.status(500).json({ error: 'storage status error', details: String(e) });
  }
});

// Admin routes
app.use('/api/admin', adminRoutes);
console.log('[SERVER DEBUG] Admin routes mounted at /api/admin');

// Public visualization route (no authentication required)
app.get('/api/visualizations', async (req, res) => {
  try {
    const Visualization = require('./models/Visualization');
    const { reportType } = req.query;
    
    const query = reportType && reportType !== 'all' ? { reportType } : {};
    const visualizations = await Visualization.find(query)
      .sort({ updatedAt: -1, createdAt: -1 });
    
    // Deduplicate by visualizationId (keep latest)
    const deduped = new Map();
    visualizations.forEach(viz => {
      const key = viz.visualizationId;
      const existing = deduped.get(key);
      const vizTime = viz.updatedAt || viz.createdAt;
      const existingTime = existing ? (existing.updatedAt || existing.createdAt) : null;
      
      if (!existing || (vizTime && existingTime && vizTime > existingTime)) {
        deduped.set(key, viz);
      }
    });
    
    // Transform for frontend
    const transformedVisualizations = Array.from(deduped.values()).map(viz => ({
      id: viz.visualizationId,
      visualizationId: viz.visualizationId,
      reportType: viz.reportType,
      imageUrl: viz.imageUrl,
      imagePublicId: viz.imagePublicId,
      createdAt: viz.createdAt,
      updatedAt: viz.updatedAt
    }));
    
    res.json(transformedVisualizations);
  } catch (error) {
    console.error('Error fetching public visualizations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug: Log all API routes
console.log('Admin routes loaded successfully');

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, and message are required' 
      });
    }

    // Import Message model
    const Message = require('./models/Message');

    // Save message to database
    const newMessage = new Message({
      name,
      email,
      message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    await newMessage.save();

    // Log the contact form submission
    console.log('Contact form submission saved:', {
      id: newMessage._id,
      name,
      email,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      success: true, 
      message: 'Thank you for your message! I will get back to you soon.' 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      error: 'Internal server error. Please try again later.' 
    });
  }
});

// Serve static files from the Next.js build

// Check if frontend build exists
if (!fs.existsSync(frontendPath)) {
  console.error(`Frontend build directory not found: ${frontendPath}`);
  console.error('Make sure to run the build command first');
} else {
  console.log(`Serving static files from: ${frontendPath}`);
  app.use(express.static(frontendPath));
}

// Fallback route for client-side routing (SPA) - only for GET requests
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Check if frontend build exists before serving
  if (!fs.existsSync(frontendPath)) {
    return res.status(500).json({ 
      error: 'Frontend not built. Please run the build command first.' 
    });
  }
  
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).json({ 
      error: 'Frontend build incomplete. index.html not found.' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Frontend path: ${frontendPath}`);
      
      // Log storage mode
      try {
        const { isCloudinaryConfigured } = require('./config/storage');
        console.log(`Storage mode: ${isCloudinaryConfigured ? 'Cloudinary' : 'Local (dev only)'}`);
      } catch (e) {
        console.warn('Storage status check failed:', e);
      }
      
      // Production warning for missing Cloudinary
      if (process.env.NODE_ENV === 'production') {
        try {
          const { isCloudinaryConfigured } = require('./config/storage');
          if (!isCloudinaryConfigured) {
            console.warn('⚠️ PRODUCTION without Cloudinary: uploads will not persist across deploys.');
          }
        } catch (e) {
          console.warn('Could not check Cloudinary configuration:', e);
        }
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
