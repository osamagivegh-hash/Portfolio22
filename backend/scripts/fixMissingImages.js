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

const fixMissingImages = async () => {
  try {
    await connectDB();

    // Get all projects
    const projects = await Project.find();
    console.log(`\nFound ${projects.length} projects to check:\n`);

    let fixedCount = 0;

    for (const project of projects) {
      console.log(`Checking: ${project.title}`);
      console.log(`Current image: ${project.image}`);
      
      let needsUpdate = false;
      let newImagePath = project.image;
      
      // Check if image file exists
      if (project.image && project.image.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '../uploads', project.image.replace('/uploads/', ''));
        const exists = fs.existsSync(imagePath);
        
        if (!exists) {
          console.log(`❌ Missing file: ${imagePath}`);
          // Set a default image based on project type
          if (project.title.includes('Data Analytics') || project.title.includes('Insurance')) {
            newImagePath = '/reports/data_analytics_report.html';
          } else {
            newImagePath = '/project-default.jpg';
          }
          needsUpdate = true;
        } else {
          console.log(`✅ File exists: ${imagePath}`);
        }
      } else if (project.image && project.image.startsWith('/reports/')) {
        // HTML reports - these should work
        console.log(`✅ HTML report: ${project.image}`);
      } else if (!project.image || project.image === '') {
        // No image set
        console.log(`❌ No image set`);
        if (project.title.includes('Data Analytics') || project.title.includes('Insurance')) {
          newImagePath = '/reports/data_analytics_report.html';
        } else {
          newImagePath = '/project-default.jpg';
        }
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        project.image = newImagePath;
        await project.save();
        console.log(`✅ Updated to: ${newImagePath}`);
        fixedCount++;
      }
      
      console.log('---');
    }

    console.log(`\n🎉 Fixed ${fixedCount} projects with missing images!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing missing images:', error);
    process.exit(1);
  }
};

fixMissingImages();
