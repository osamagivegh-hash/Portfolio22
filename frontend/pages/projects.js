import Layout from '../components/Layout'
import Head from 'next/head'

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution built with Next.js, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
      image: '/project1.jpg',
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      image: '/project2.jpg',
      technologies: ['React', 'Express', 'Socket.io', 'PostgreSQL'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'A responsive weather dashboard that displays current weather conditions and forecasts for multiple cities with interactive charts.',
      image: '/project3.jpg',
      technologies: ['Vue.js', 'Chart.js', 'OpenWeather API'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    },
    {
      id: 4,
      title: 'Blog CMS',
      description: 'A content management system for blogs with markdown support, SEO optimization, and multi-author capabilities.',
      image: '/project4.jpg',
      technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    },
    {
      id: 5,
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website built with Next.js and deployed on Vercel with contact form integration.',
      image: '/project5.jpg',
      technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    },
    {
      id: 6,
      title: 'API Gateway',
      description: 'A microservices API gateway with authentication, rate limiting, and request routing capabilities.',
      image: '/project6.jpg',
      technologies: ['Node.js', 'Express', 'Redis', 'JWT'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    }
  ]

  const featuredProjects = projects.filter(project => project.featured)
  const otherProjects = projects.filter(project => !project.featured)

  return (
    <>
      <Head>
        <title>Projects - Portfolio</title>
        <meta name="description" content="Explore my portfolio of web development projects" />
      </Head>
      
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              My Projects
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here are some of the projects I&apos;ve worked on. Each project represents 
              a unique challenge and learning opportunity.
            </p>
          </div>

          {/* Featured Projects */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Featured Projects
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <div key={project.id} className="card group hover:shadow-xl transition-shadow duration-300">
                  <div className="mb-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDQwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI0MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIxMTIiIGZpbGw9IiNEOUQ5REQiLz4KPHN2ZyB4PSIxNzUiIHk9Ijc2IiB3aWR0aD0iNTAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA1MCA0MCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yNSAyMEMxMS4xOTIgMjAgMCAyOS4xOTIgMCA0MHMxMS4xOTIgMjAgMjUgMjAgMjUtOS4xOTIgMjUtMjBTMzguODA4IDIwIDI1IDIwWk0yNSAzMEMyMS42ODYgMzAgMTkgMzIuNjg2IDE5IDM2czIuNjg2IDYgNiA2IDYtMi42ODYgNi02LTIuNjg2LTYtNi02WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4KPC9zdmc+'
                      }}
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm"
                    >
                      GitHub
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm"
                    >
                      Live Demo
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Projects */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Other Projects
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <div key={project.id} className="card group hover:shadow-xl transition-shadow duration-300">
                  <div className="mb-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjMwIiB5PSIzMCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNEOUQ5REQiLz4KPHN2ZyB4PSIxMjUiIHk9IjYwIiB3aWR0aD0iNTAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA1MCA0MCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yNSAyMEMxMS4xOTIgMjAgMCAyOS4xOTIgMCA0MHMxMS4xOTIgMjAgMjUgMjAgMjUtOS4xOTIgMjUtMjBTMzguODA4IDIwIDI1IDIwWk0yNSAzMEMyMS42ODYgMzAgMTkgMzIuNjg2IDE5IDM2czIuNjg2IDYgNiA2IDYtMi42ODYgNi02LTIuNjg2LTYtNi02WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4KPC9zdmc+'
                      }}
                    />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs flex-1 text-center"
                    >
                      GitHub
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs flex-1 text-center"
                    >
                      Demo
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
