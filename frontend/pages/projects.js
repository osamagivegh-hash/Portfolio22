import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Head from 'next/head'
import Link from 'next/link'
import { fetchPortfolioData } from '../utils/api'
import VideoModal from '../components/VideoModal'

// Category styles
const categoryStyles = {
  ERP: 'category-erp',
  CRM: 'category-crm',
  Admin: 'category-admin',
  Tracking: 'category-tracking',
  'E-Commerce': 'category-ecommerce',
  SaaS: 'category-saas',
  Other: 'tag',
}

const categories = [
  { value: 'all', label: 'All Projects' },
  { value: 'ERP', label: 'ERP Systems' },
  { value: 'CRM', label: 'CRM Solutions' },
  { value: 'Admin', label: 'Admin Panels' },
  { value: 'Tracking', label: 'Tracking' },
  { value: 'E-Commerce', label: 'E-Commerce' },
  { value: 'SaaS', label: 'SaaS' },
]

export default function Projects() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [filteredProjects, setFilteredProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPortfolioData()
        setPortfolioData(data)
        setFilteredProjects(data?.projects || [])
      } catch (error) {
        console.error('Error loading portfolio data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter projects by category
  useEffect(() => {
    if (!portfolioData?.projects) return

    if (selectedCategory === 'all') {
      setFilteredProjects(portfolioData.projects)
    } else {
      setFilteredProjects(
        portfolioData.projects.filter(p => p.category === selectedCategory)
      )
    }
  }, [selectedCategory, portfolioData])

  const handlePlayVideo = (project) => {
    if (project.videoUrl) {
      setSelectedVideo({
        ...project,
        thumbnailUrl: project.videoThumbnailUrl || project.image,
      })
      setIsModalOpen(true)
    }
  }

  const featuredProjects = filteredProjects.filter(p => p.featured)
  const regularProjects = filteredProjects.filter(p => !p.featured)

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-slate-400">Loading projects...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <>
      <Head>
        <title>Projects - Portfolio</title>
        <meta name="description" content="Explore my portfolio of web development projects including ERP systems, CRM solutions, admin dashboards, and more." />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-700/15 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="gradient-text">My Projects</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-8">
                Enterprise-grade solutions, ERP systems, CRM platforms, and modern web applications.
                Each project is built with scalability, performance, and user experience in mind.
              </p>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat.value
                        ? 'bg-gradient-primary text-white shadow-glow'
                        : 'bg-dark-tertiary text-slate-400 hover:text-white hover:bg-dark-card-hover'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-tertiary flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                <p className="text-slate-400">
                  {selectedCategory !== 'all'
                    ? 'No projects in this category. Try another filter.'
                    : 'No projects available yet.'}
                </p>
              </div>
            ) : (
              <>
                {/* Featured Projects */}
                {featuredProjects.length > 0 && (
                  <div className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                      <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2Z" />
                      </svg>
                      Featured Projects
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {featuredProjects.map((project, index) => (
                        <div
                          key={project.id}
                          className="card group overflow-hidden animate-fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {/* Project Image/Video */}
                          <div className="relative overflow-hidden rounded-lg mb-6 aspect-video">
                            <img
                              src={project.image?.startsWith('http') ? project.image : `${typeof window !== 'undefined' ? window.location.origin : ''}${project.image || '/project-default.jpg'}`}
                              alt={project.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgdmlld0JveD0iMCAwIDY0MCAzNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2NDAiIGhlaWdodD0iMzYwIiBmaWxsPSIjMWExYTI1Ii8+CjxyZWN0IHg9IjI3MCIgeT0iMTMwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjgiIGZpbGw9IiM3YzNhZWQiLz4KPC9zdmc+'
                              }}
                            />

                            {/* Video Play Overlay */}
                            {project.hasVideo && project.videoUrl && (
                              <div
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => handlePlayVideo(project)}
                              >
                                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center transform hover:scale-110 transition-transform">
                                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                                <span className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                                  Watch Demo
                                </span>
                              </div>
                            )}

                            {/* Category Badge */}
                            {project.category && (
                              <div className="absolute top-4 left-4">
                                <span className={categoryStyles[project.category] || 'tag'}>
                                  {project.category}
                                </span>
                              </div>
                            )}

                            {/* Video Badge */}
                            {project.hasVideo && (
                              <div className="absolute top-4 right-4 px-2 py-1 bg-black/70 rounded-md flex items-center gap-1 text-xs text-white">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                                Video Demo
                              </div>
                            )}
                          </div>

                          {/* Project Info */}
                          <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                              {project.title}
                            </h3>

                            <p className="text-slate-400">
                              {project.businessDescription || project.description}
                            </p>

                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-2">
                              {project.technologies?.map((tech) => (
                                <span key={tech} className="tag text-xs">{tech}</span>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-white/5">
                              {project.hasVideo && project.videoUrl && (
                                <button
                                  onClick={() => handlePlayVideo(project)}
                                  className="btn-primary text-sm flex-1"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                  Watch Demo
                                </button>
                              )}
                              {project.demo && (
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`btn-${project.hasVideo ? 'secondary' : 'primary'} text-sm flex-1 text-center`}
                                >
                                  Live Demo
                                </a>
                              )}
                              {project.github && (
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-ghost text-sm flex-1 text-center"
                                >
                                  GitHub
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Projects Grid */}
                {regularProjects.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-8">
                      {selectedCategory === 'all' ? 'All Projects' : `${selectedCategory} Projects`}
                      <span className="ml-2 text-sm font-normal text-slate-500">
                        ({regularProjects.length} projects)
                      </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {regularProjects.map((project, index) => (
                        <div
                          key={project.id}
                          className="card group animate-fade-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          {/* Project Thumbnail */}
                          <div className="relative overflow-hidden rounded-lg mb-4 aspect-video">
                            <img
                              src={project.image?.startsWith('http') ? project.image : `${typeof window !== 'undefined' ? window.location.origin : ''}${project.image || '/project-default.jpg'}`}
                              alt={project.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjMWExYTI1Ii8+CjxyZWN0IHg9IjE1MCIgeT0iNjIiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iOCIgZmlsbD0iIzdjM2FlZCIvPgo8L3N2Zz4='
                              }}
                            />

                            {/* Video Play Button */}
                            {project.hasVideo && project.videoUrl && (
                              <div
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => handlePlayVideo(project)}
                              >
                                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            )}

                            {/* Category */}
                            {project.category && (
                              <div className="absolute top-2 left-2">
                                <span className={`${categoryStyles[project.category] || 'tag'} text-2xs`}>
                                  {project.category}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
                            {project.title}
                          </h3>

                          <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Tech Stack */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.technologies?.slice(0, 4).map((tech) => (
                              <span key={tech} className="tag text-xs">{tech}</span>
                            ))}
                            {project.technologies?.length > 4 && (
                              <span className="tag text-xs">+{project.technologies.length - 4}</span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-3 border-t border-white/5">
                            {project.hasVideo && project.videoUrl ? (
                              <button
                                onClick={() => handlePlayVideo(project)}
                                className="btn-primary text-xs flex-1"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                                Demo
                              </button>
                            ) : project.demo ? (
                              <a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary text-xs flex-1 text-center"
                              >
                                Demo
                              </a>
                            ) : null}
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-ghost text-xs flex-1 text-center"
                              >
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-glass text-center p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Interested in working together?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                I&apos;m available for freelance projects, full-time positions,
                and consulting work. Let&apos;s build something amazing together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary">
                  Get In Touch
                </Link>
                <Link href="/gallery" className="btn-secondary">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  View Video Gallery
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Video Modal */}
        <VideoModal
          video={selectedVideo}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedVideo(null)
          }}
        />
      </Layout>
    </>
  )
}
