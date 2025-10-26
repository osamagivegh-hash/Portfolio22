const mongoose = require('mongoose');
const Project = require('./models/Project');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  const project = await Project.findOne({ title: 'Data Analytics Dashboard' });
  if (project) {
    project.image = '/reports/data_analytics_report.html';
    project.demo = '/reports/data_analytics_report.html';
    await project.save();
    console.log('✅ Fixed Data Analytics Dashboard project');
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});