const mongoose = require('mongoose');
const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const testImagePaths = async () => {
  try {
    await connectDB();

    // Get all projects
    const projects = await Project.find();
    console.log(`\nFound ${projects.length} projects:\n`);

    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   Image path: ${project.image}`);
      
      // Check if image file exists
      if (project.image) {
        let imagePath;
        if (project.image.startsWith('/')) {
          // Check in frontend public directory
          imagePath = path.join(__dirname, '../../frontend/public', project.image);
        } else {
          // Check in uploads directory
          imagePath = path.join(__dirname, '../uploads', project.image);
        }
        
        const exists = fs.existsSync(imagePath);
        console.log(`   File exists: ${exists}`);
        console.log(`   Full path: ${imagePath}`);
        
        if (!exists) {
          console.log(`   ❌ MISSING FILE!`);
        } else {
          console.log(`   ✅ File found`);
        }
      }
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing image paths:', error);
    process.exit(1);
  }
};

testImagePaths();
