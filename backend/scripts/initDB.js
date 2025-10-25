const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const initializeDatabase = async () => {
  try {
    await connectDB();

    // Create default admin user
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const adminUser = new User({
        username: 'admin',
        password: 'password', // This will be hashed by the pre-save middleware
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Default admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create default profile
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      const defaultProfile = new Profile({
        name: 'John Doe',
        title: 'Full-Stack Developer & UI/UX Designer',
        bio: 'Passionate about creating beautiful, functional, and user-centered digital experiences. I specialize in modern web technologies and love turning complex problems into simple, elegant solutions.',
        email: 'john@example.com',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        profileImage: '/profile.jpg'
      });
      await defaultProfile.save();
      console.log('✅ Default profile created');
    } else {
      console.log('ℹ️  Profile already exists');
    }

    // Create default skills
    const existingSkills = await Skill.find();
    if (existingSkills.length === 0) {
      const defaultSkills = [
        'React/Next.js',
        'Node.js/Express',
        'TypeScript',
        'Tailwind CSS',
        'MongoDB',
        'PostgreSQL',
        'AWS',
        'Docker'
      ];

      const skillPromises = defaultSkills.map((skillName, index) => 
        new Skill({ name: skillName, order: index }).save()
      );
      
      await Promise.all(skillPromises);
      console.log('✅ Default skills created');
    } else {
      console.log('ℹ️  Skills already exist');
    }

    // Create default projects
    const existingProjects = await Project.find();
    if (existingProjects.length === 0) {
      const defaultProjects = [
        {
          title: 'E-Commerce Platform',
          description: 'A full-stack e-commerce solution built with Next.js, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
          technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: true,
          image: '/project1.jpg',
          order: 0
        },
        {
          title: 'Task Management App',
          description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
          technologies: ['React', 'Express', 'Socket.io', 'PostgreSQL'],
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: true,
          image: '/project2.jpg',
          order: 1
        }
      ];

      const projectPromises = defaultProjects.map(projectData => 
        new Project(projectData).save()
      );
      
      await Promise.all(projectPromises);
      console.log('✅ Default projects created');
    } else {
      console.log('ℹ️  Projects already exist');
    }

    console.log('🎉 Database initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase();
