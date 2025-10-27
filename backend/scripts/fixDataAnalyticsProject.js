const mongoose = require('mongoose');
const Project = require('../models/Project');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  const project = await Project.findOne({ title: 'Data Analytics Dashboard' });
  if (project) {
    console.log('Found project:', project.title);
    console.log('Current image:', project.image);
    console.log('Current demo:', project.demo);
    
    // Update the project to use the HTML report for the demo and a static preview for the image
    project.image = '/reports/data_analytics_preview.svg';
    project.imagePublicId = null;
    project.demo = '/reports/data_analytics_report.html';
    await project.save();
    console.log('✅ Updated project image to:', project.image);
    console.log('✅ Updated project demo to:', project.demo);
    console.log('\n✅ Data Analytics Dashboard project fixed!');
  } else {
    console.log('❌ Data Analytics Dashboard project not found');
  }
  
  process.exit(0);
}).catch(err => {
  console.error('❌ Error fixing Data Analytics Dashboard:', err);
  process.exit(1);
});