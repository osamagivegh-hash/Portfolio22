const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');
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
  await connectDB();

  try {
    console.log('🔍 Checking for missing images...\n');

    // Fix profile images
    const profiles = await Profile.find();
    for (const profile of profiles) {
      if (profile.profileImage && profile.profileImage.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '../uploads', path.basename(profile.profileImage));
        if (!fs.existsSync(imagePath)) {
          console.log(`❌ Profile image missing: ${profile.profileImage}`);
          profile.profileImage = '/profile.jpg'; // Set to default
          await profile.save();
          console.log(`✅ Updated profile image to: ${profile.profileImage}`);
        } else {
          console.log(`✅ Profile image exists: ${profile.profileImage}`);
        }
      }
    }

    // Fix project images
    const projects = await Project.find();
    for (const project of projects) {
      // Skip HTML reports
      if (project.image && project.image.endsWith('.html')) {
        console.log(`✅ HTML report project: ${project.title}`);
        continue;
      }

      if (project.image && project.image.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, '../uploads', path.basename(project.image));
        if (!fs.existsSync(imagePath)) {
          console.log(`❌ Project image missing: ${project.image} for ${project.title}`);
          project.image = '/project-default.jpg'; // Set to default
          await project.save();
          console.log(`✅ Updated project image to: ${project.image}`);
        } else {
          console.log(`✅ Project image exists: ${project.image} for ${project.title}`);
        }
      } else if (project.image && !project.image.startsWith('/uploads/')) {
        // Check if it's a default image that exists in frontend/public
        const frontendImagePath = path.join(__dirname, '../../frontend/public', project.image);
        if (!fs.existsSync(frontendImagePath)) {
          console.log(`❌ Default image missing: ${project.image} for ${project.title}`);
          project.image = '/project-default.jpg';
          await project.save();
          console.log(`✅ Updated project image to: ${project.image}`);
        } else {
          console.log(`✅ Default image exists: ${project.image} for ${project.title}`);
        }
      }
    }

    console.log('\n✅ Image fix completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing images:', error);
    process.exit(1);
  }
};

fixMissingImages();