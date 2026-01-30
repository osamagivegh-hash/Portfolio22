import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Head from 'next/head'
import Link from 'next/link'
import { fetchPortfolioData } from '../utils/api'

export default function Home() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPortfolioData()
        setPortfolioData(data)
      } catch (error) {
        console.error('Error loading portfolio data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  const profile = portfolioData?.profile
  const skills = portfolioData?.skills || []
  const projects = portfolioData?.projects?.slice(0, 3) || []

  return (
    <>
      <Head>
        <title>{profile?.name || 'Portfolio'} - Full-Stack Developer</title>
        <meta name="description" content={profile?.bio || "Full-Stack Developer specializing in enterprise solutions, ERP systems, and modern web applications."} />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/15 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-700/10 to-transparent rounded-full" />
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              {/* Profile Image */}
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-40 scale-110 animate-pulse-slow" />
                <img
                  src={profile?.profileImage ? (profile.profileImage.startsWith('http') ? profile.profileImage : `${typeof window !== 'undefined' ? window.location.origin : ''}${profile.profileImage}`) : '/profile.jpg'}
                  alt={profile?.name || 'Profile'}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-dark-tertiary relative shadow-xl"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMWExYTI1Ii8+CjxjaXJjbGUgY3g9IjgwIiBjeT0iNjAiIHI9IjI1IiBmaWxsPSIjN2MzYWVkIi8+CjxwYXRoIGQ9Ik0zNSAxMzBDMzUgMTA1IDU1IDg1IDgwIDg1QzEwNSA4NSAxMjUgMTA1IDEyNSAxMzBWMTYwSDM1VjEzMFoiIGZpbGw9IiM3YzNhZWQiLz4KPC9zdmc+'
                  }}
                />
              </div>

              {/* Name & Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in">
                <span className="text-white">{profile?.name?.split(' ')[0] || 'John'}</span>{' '}
                <span className="gradient-text">{profile?.name?.split(' ').slice(1).join(' ') || 'Doe'}</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-400 mb-6 animate-fade-in animation-delay-100">
                {profile?.title || 'Full-Stack Developer & UI/UX Designer'}
              </p>

              <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 animate-fade-in animation-delay-200">
                {profile?.bio || 'Passionate about creating beautiful, functional, and user-centered digital experiences. I specialize in modern web technologies and love turning complex problems into simple, elegant solutions.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-300">
                <Link href="/projects" className="btn-primary group">
                  View My Work
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/gallery" className="btn-secondary group">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Demos
                </Link>
                <Link href="/contact" className="btn-ghost">
                  Get In Touch
                </Link>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
                <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">5+</div>
                <div className="text-slate-400">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">50+</div>
                <div className="text-slate-400">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">20+</div>
                <div className="text-slate-400">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">10+</div>
                <div className="text-slate-400">Technologies</div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title mb-4">Skills & Technologies</h2>
              <p className="section-subtitle">
                Technologies I work with to build scalable, enterprise-grade solutions
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.length > 0 ? skills.map((skill, index) => (
                <div
                  key={skill}
                  className="card text-center py-6 animate-fade-in glow-hover"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <h3 className="font-medium text-white">{skill}</h3>
                </div>
              )) : (
                ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Next.js', 'GraphQL', 'Redis', 'Tailwind', 'Python'].map((skill, index) => (
                  <div
                    key={skill}
                    className="card text-center py-6 animate-fade-in glow-hover"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <h3 className="font-medium text-white">{skill}</h3>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20 bg-dark-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title mb-4">Featured Projects</h2>
              <p className="section-subtitle">
                A selection of enterprise solutions and applications I&apos;ve developed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {projects.length > 0 ? projects.map((project, index) => (
                <div
                  key={project.id}
                  className="card group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={project.image?.startsWith('http') ? project.image : `${typeof window !== 'undefined' ? window.location.origin : ''}${project.image || '/project-default.jpg'}`}
                      alt={project.title}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMWExYTI1Ii8+CjxyZWN0IHg9IjE1MCIgeT0iNzAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjN2MzYWVkIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEwMCIgcj0iMTUiIGZpbGw9IndoaXRlIi8+'
                      }}
                    />
                    {project.hasVideo && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                          <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {project.category && (
                    <span className={`category-${project.category.toLowerCase().replace('-', '')} mb-3 inline-block`}>
                      {project.category}
                    </span>
                  )}

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies?.slice(0, 4).map((tech) => (
                      <span key={tech} className="tag text-xs">{tech}</span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm flex-1 text-center">
                        GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex-1 text-center">
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              )) : (
                // Placeholder projects
                [1, 2, 3].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="w-full h-48 bg-dark-tertiary rounded-lg mb-4"></div>
                    <div className="h-4 bg-dark-tertiary rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-dark-tertiary rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-dark-tertiary rounded w-full mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-dark-tertiary rounded w-1/2"></div>
                      <div className="h-8 bg-dark-tertiary rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-center">
              <Link href="/projects" className="btn-secondary inline-flex items-center gap-2">
                View All Projects
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-glass text-center p-8 md:p-12 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary-600/20 rounded-full blur-3xl" />

              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Let&apos;s Work Together
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                  I&apos;m always interested in new opportunities, whether you have a project
                  in mind or just want to connect. Feel free to reach out!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact" className="btn-primary">
                    Start a Conversation
                  </Link>
                  <a
                    href={`mailto:${profile?.email || 'contact@example.com'}`}
                    className="btn-secondary"
                  >
                    {profile?.email || 'contact@example.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
