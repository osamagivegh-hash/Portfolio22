// API utility functions for fetching portfolio data

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Fetch portfolio data (public endpoint - no auth required)
export const fetchPortfolioData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/portfolio`)
    if (response.ok) {
      const data = await response.json()
      // Transform MongoDB data to match frontend expectations
      return {
        profile: data.profile,
        projects: data.projects.map(project => ({
          ...project,
          id: project._id // Convert MongoDB _id to id for frontend compatibility
        })),
        skills: data.skills
      }
    }
    throw new Error('Failed to fetch portfolio data')
  } catch (error) {
    console.error('Error fetching portfolio data:', error)
    // Return default data if API fails
    return {
      profile: {
        name: 'John Doe',
        title: 'Full-Stack Developer & UI/UX Designer',
        bio: 'Passionate about creating beautiful, functional, and user-centered digital experiences. I specialize in modern web technologies and love turning complex problems into simple, elegant solutions.',
        email: 'john@example.com',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        profileImage: '/profile.jpg'
      },
      projects: [
        {
          id: 1,
          title: 'E-Commerce Platform',
          description: 'A full-stack e-commerce solution built with Next.js, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
          technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: true,
          image: '/project1.jpg'
        },
        {
          id: 2,
          title: 'Task Management App',
          description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
          technologies: ['React', 'Express', 'Socket.io', 'PostgreSQL'],
          github: 'https://github.com',
          demo: 'https://demo.com',
          featured: true,
          image: '/project2.jpg'
        }
      ],
      skills: [
        'React/Next.js',
        'Node.js/Express',
        'TypeScript',
        'Tailwind CSS',
        'MongoDB',
        'PostgreSQL',
        'AWS',
        'Docker'
      ]
    }
  }
}

// Admin API functions (require authentication)
export const adminAPI = {
  // Login
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    return response.json()
  },

  // Verify token
  verifyToken: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  // Get portfolio data (admin)
  getPortfolio: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/portfolio`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  // Update profile
  updateProfile: async (token, profileData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/portfolio/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData),
    })
    return response.json()
  },

  // Upload profile image
  uploadProfileImage: async (token, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await fetch(`${API_BASE_URL}/api/admin/portfolio/profile/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    })
    return response.json()
  },

  // Get projects
  getProjects: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/portfolio/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  // Add project
  addProject: async (token, projectData) => {
    const formData = new FormData()
    Object.keys(projectData).forEach(key => {
      formData.append(key, projectData[key])
    })
    
    const response = await fetch(`${API_BASE_URL}/api/admin/portfolio/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    })
    return response.json()
  },

  // Update project
  updateProject: async (token, projectId, projectData) => {
    const formData = new FormData()
    Object.keys(projectData).forEach(key => {
      formData.append(key, projectData[key])
    })
    
    const response = await fetch(`${API_BASE_URL}/api/admin/portfolio/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    })
    return response.json()
  },

  // Delete project
  deleteProject: async (token, projectId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/portfolio/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  // Update skills
  updateSkills: async (token, skills) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/portfolio/skills`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ skills }),
    })
    return response.json()
  },

  // Get messages
  getMessages: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  }
}
