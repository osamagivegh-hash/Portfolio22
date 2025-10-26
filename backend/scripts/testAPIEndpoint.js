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

const testAPIEndpoint = async () => {
  try {
    await connectDB();

    // Simulate the API endpoint logic
    const Profile = require('../models/Profile');
    const Project = require('../models/Project');
    const Skill = require('../models/Skill');

    const [profile, projects, skills] = await Promise.all([
      Profile.findOne().sort({ createdAt: -1 }),
      Project.find().sort({ order: 1, createdAt: -1 }),
      Skill.find().sort({ order: 1, createdAt: -1 })
    ]);

    const response = {
      profile: profile || {
        name: 'John Doe',
        title: 'Full-Stack Developer & UI/UX Designer',
        bio: 'Passionate about creating beautiful, functional, and user-centered digital experiences.',
        email: 'john@example.com',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        profileImage: '/profile.jpg'
      },
      projects: projects ? projects.map(project => ({
        ...project.toObject(),
        id: project._id
      })) : [],
      skills: skills.map(skill => skill.name) || []
    };

    console.log('API Response Sample:');
    console.log('Profile:', JSON.stringify(response.profile, null, 2));
    console.log('\nFirst Project:', JSON.stringify(response.projects[0], null, 2));
    console.log('\nSkills:', response.skills);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing API endpoint:', error);
    process.exit(1);
  }
};

testAPIEndpoint();
