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

const debugImageIssue = async () => {
  try {
    await connectDB();

    // Get all projects
    const projects = await Project.find();
    console.log(`\nFound ${projects.length} projects:\n`);

    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   Image path: ${project.image}`);
      console.log(`   Demo URL: ${project.demo}`);
      
      // Check different possible locations for the image
      if (project.image) {
        const possiblePaths = [
          // Check in backend uploads
          path.join(__dirname, '../uploads', project.image.replace('/uploads/', '')),
          // Check in frontend public
          path.join(__dirname, '../../frontend/public', project.image),
          // Check if it's a relative path
          path.join(__dirname, '../../frontend/public', project.image.replace('/', ''))
        ];
        
        possiblePaths.forEach((imagePath, i) => {
          const exists = fs.existsSync(imagePath);
          console.log(`   Path ${i+1}: ${exists ? '✅' : '❌'} ${imagePath}`);
        });
      }
      console.log('---');
    });

    // Test the API endpoint
    console.log('\n🔍 Testing API endpoint...');
    const transformedProjects = projects.map(project => ({
      ...project.toObject(),
      id: project._id
    }));
    
    console.log('Sample transformed project:');
    console.log(JSON.stringify(transformedProjects[0], null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error debugging image issue:', error);
    process.exit(1);
  }
};

debugImageIssue();
