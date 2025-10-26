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

const testProjects = async () => {
  try {
    await connectDB();

    // Get all projects
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    console.log(`\nFound ${projects.length} projects:\n`);

    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   Description: ${project.description.substring(0, 100)}...`);
      console.log(`   Image: ${project.image}`);
      console.log(`   Demo: ${project.demo}`);
      console.log(`   Featured: ${project.featured}`);
      console.log(`   Technologies: ${project.technologies.join(', ')}`);
      console.log(`   Order: ${project.order}`);
      console.log('---');
    });

    // Test the public API endpoint data transformation
    console.log('\nTesting API transformation:');
    const transformedProjects = projects.map(project => ({
      ...project.toObject(),
      id: project._id
    }));

    console.log('Transformed projects (first 2):');
    transformedProjects.slice(0, 2).forEach(project => {
      console.log(`- ${project.title} (ID: ${project.id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing projects:', error);
    process.exit(1);
  }
};

testProjects();
