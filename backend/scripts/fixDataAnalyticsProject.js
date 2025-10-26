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

const fixDataAnalyticsProject = async () => {
  await connectDB();

  try {
    console.log('🔍 Fixing Data Analytics Dashboard project...\n');

    // Find the Data Analytics Dashboard project
    const project = await Project.findOne({ title: 'Data Analytics Dashboard' });
    
    if (!project) {
      console.log('❌ Data Analytics Dashboard project not found');
      return;
    }

    console.log(`Found project: ${project.title}`);
    console.log(`Current image: ${project.image}`);
    console.log(`Current demo: ${project.demo}`);

    // Update the project to use the HTML report as both image and demo
    project.image = '/reports/data_analytics_report.html';
    project.demo = '/reports/data_analytics_report.html';
    
    await project.save();
    
    console.log(`✅ Updated project image to: ${project.image}`);
    console.log(`✅ Updated project demo to: ${project.demo}`);

    console.log('\n✅ Data Analytics Dashboard project fixed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing Data Analytics Dashboard:', error);
    process.exit(1);
  }
};

fixDataAnalyticsProject();
