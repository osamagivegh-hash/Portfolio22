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

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Admin routes
app.use('/api/admin', adminRoutes);

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
const frontendPath = path.join(__dirname, '../frontend/out');

// Check if frontend build exists
if (!fs.existsSync(frontendPath)) {
  console.error(`Frontend build directory not found: ${frontendPath}`);
  console.error('Make sure to run the build command first');
} else {
  console.log(`Serving static files from: ${frontendPath}`);
  app.use(express.static(frontendPath));
}

// Fallback route for client-side routing (SPA)
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
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
