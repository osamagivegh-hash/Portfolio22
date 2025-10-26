const mongoose = require('mongoose');
const Project = require('../models/Project');
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

const fixImagePaths = async () => {
  try {
    await connectDB();

    // Get all projects
    const projects = await Project.find();
    console.log(`Found ${projects.length} projects`);

    for (const project of projects) {
      console.log(`\nProject: ${project.title}`);
      console.log(`Current image: ${project.image}`);
      
      // Fix image paths
      if (project.image && !project.image.startsWith('http') && !project.image.startsWith('/')) {
        // If image doesn't start with /, add it
        project.image = `/${project.image}`;
        console.log(`Fixed to: ${project.image}`);
      } else if (!project.image || project.image === '') {
        // Set default image for projects without images
        if (project.title.includes('Data Analytics') || project.title.includes('Insurance')) {
          project.image = '/reports/data_analytics_report.html'; // This will be handled by the frontend
        } else {
          project.image = '/project-default.jpg';
        }
        console.log(`Set default image: ${project.image}`);
      }
      
      await project.save();
    }

    console.log('\n✅ Image paths fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing image paths:', error);
    process.exit(1);
  }
};

fixImagePaths();
