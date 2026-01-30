import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import VideoCard from '../components/VideoCard'
import VideoModal from '../components/VideoModal'

const categories = [
    { value: 'all', label: 'All Videos' },
    { value: 'ERP', label: 'ERP Systems' },
    { value: 'CRM', label: 'CRM Solutions' },
    { value: 'Admin', label: 'Admin Dashboards' },
    { value: 'Tracking', label: 'Tracking Systems' },
    { value: 'E-Commerce', label: 'E-Commerce' },
    { value: 'SaaS', label: 'SaaS Products' },
]

export default function Gallery() {
    const [videos, setVideos] = useState([])
    const [filteredVideos, setFilteredVideos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [error, setError] = useState(null)

    // Fetch videos from API
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const baseUrl = typeof window !== 'undefined'
                    ? window.location.origin
                    : process.env.NEXT_PUBLIC_API_URL || ''

                const response = await fetch(`${baseUrl}/api/videos`)

                if (!response.ok) {
                    throw new Error('Failed to fetch videos')
                }

                const data = await response.json()
                setVideos(data)
                setFilteredVideos(data)
            } catch (err) {
                console.error('Error fetching videos:', err)
                setError(err.message)
                // Set demo videos for development
                const demoVideos = getDemoVideos()
                setVideos(demoVideos)
                setFilteredVideos(demoVideos)
            } finally {
                setIsLoading(false)
            }
        }

        fetchVideos()
    }, [])

    // Filter videos by category
    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredVideos(videos)
        } else {
            setFilteredVideos(videos.filter(v => v.category === selectedCategory))
        }
    }, [selectedCategory, videos])

    // Handle video click
    const handleVideoClick = async (video) => {
        setSelectedVideo(video)
        setIsModalOpen(true)

        // Increment view count
        try {
            const baseUrl = typeof window !== 'undefined'
                ? window.location.origin
                : process.env.NEXT_PUBLIC_API_URL || ''

            const videoId = video._id || video.id
            await fetch(`${baseUrl}/api/videos/${videoId}/view`, {
                method: 'POST',
            })
        } catch (err) {
            console.error('Error incrementing view count:', err)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedVideo(null)
    }

    const featuredVideos = filteredVideos.filter(v => v.featured)
    const regularVideos = filteredVideos.filter(v => !v.featured)

    return (
        <>
            <Head>
                <title>Video Gallery - Portfolio</title>
                <meta name="description" content="Watch video demos of ERP, CRM, Admin Systems, and more enterprise software solutions." />
            </Head>

            <Layout>
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-700/20 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                <span className="gradient-text">Video Gallery</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400 mb-8">
                                Explore video demonstrations of enterprise solutions, ERP systems,
                                CRM platforms, and modern web applications I&apos;ve built.
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

                {/* Videos Section */}
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="spinner mb-4"></div>
                                <p className="text-slate-400">Loading videos...</p>
                            </div>
                        ) : filteredVideos.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-tertiary flex items-center justify-center">
                                    <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">No videos found</h3>
                                <p className="text-slate-400">
                                    {selectedCategory !== 'all'
                                        ? 'No videos in this category yet. Try another category or check back later.'
                                        : 'No videos have been added yet. Check back soon!'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Featured Videos */}
                                {featuredVideos.length > 0 && (
                                    <div className="mb-12">
                                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                            <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2Z" />
                                            </svg>
                                            Featured Demos
                                        </h2>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {featuredVideos.map((video) => (
                                                <VideoCard
                                                    key={video._id || video.id}
                                                    video={video}
                                                    onClick={handleVideoClick}
                                                    featured
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* All Videos Grid */}
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">
                                        {selectedCategory === 'all' ? 'All Videos' : `${selectedCategory} Videos`}
                                        <span className="ml-2 text-sm font-normal text-slate-500">
                                            ({regularVideos.length} videos)
                                        </span>
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {regularVideos.map((video, index) => (
                                            <div
                                                key={video._id || video.id}
                                                className="animate-fade-in"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                <VideoCard
                                                    video={video}
                                                    onClick={handleVideoClick}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="card-glass text-center p-8 md:p-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Need a Similar Solution?
                            </h2>
                            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                                I specialize in building enterprise-grade ERP systems, CRM platforms,
                                admin dashboards, and custom web applications. Let&apos;s discuss your project.
                            </p>
                            <a href="/contact" className="btn-primary inline-flex items-center gap-2">
                                Start a Project
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Video Modal */}
                <VideoModal
                    video={selectedVideo}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            </Layout>
        </>
    )
}

// Demo videos for development/fallback
function getDemoVideos() {
    return [
        {
            id: '1',
            title: 'Enterprise ERP System',
            description: 'Complete ERP solution with inventory management, HR, accounting, and reporting modules.',
            businessDescription: 'A comprehensive enterprise resource planning system designed for mid to large-sized businesses. Features include real-time inventory tracking, employee management, financial reporting, and customizable dashboards.',
            videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/elephants.mp4',
            thumbnailUrl: 'https://res.cloudinary.com/demo/video/upload/so_0,w_640,h_360,c_fill/v1/samples/elephants.jpg',
            category: 'ERP',
            technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
            duration: 180,
            views: 1250,
            featured: true,
            demoUrl: '#',
            githubUrl: '#',
        },
        {
            id: '2',
            title: 'CRM Dashboard',
            description: 'Customer relationship management system with lead tracking and analytics.',
            businessDescription: 'Modern CRM platform with AI-powered lead scoring, sales pipeline management, and comprehensive customer analytics.',
            videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/sea-turtle.mp4',
            thumbnailUrl: 'https://res.cloudinary.com/demo/video/upload/so_0,w_640,h_360,c_fill/v1/samples/sea-turtle.jpg',
            category: 'CRM',
            technologies: ['Next.js', 'GraphQL', 'MongoDB', 'Tailwind'],
            duration: 240,
            views: 890,
            featured: true,
            demoUrl: '#',
            githubUrl: '#',
        },
        {
            id: '3',
            title: 'Admin Dashboard',
            description: 'Feature-rich admin panel with user management and analytics.',
            videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/cld-sample-video.mp4',
            thumbnailUrl: 'https://res.cloudinary.com/demo/video/upload/so_0,w_640,h_360,c_fill/v1/samples/cld-sample-video.jpg',
            category: 'Admin',
            technologies: ['React', 'Express', 'MySQL', 'Chart.js'],
            duration: 120,
            views: 567,
            featured: false,
        },
        {
            id: '4',
            title: 'Store Tracker',
            description: 'Real-time store inventory and sales tracking application.',
            videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/elephants.mp4',
            thumbnailUrl: 'https://res.cloudinary.com/demo/video/upload/so_0,w_640,h_360,c_fill/v1/samples/elephants.jpg',
            category: 'Tracking',
            technologies: ['Vue.js', 'Firebase', 'Socket.io'],
            duration: 150,
            views: 423,
            featured: false,
        },
        {
            id: '5',
            title: 'E-Commerce Platform',
            description: 'Full-featured online store with payment integration.',
            videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/sea-turtle.mp4',
            thumbnailUrl: 'https://res.cloudinary.com/demo/video/upload/so_0,w_640,h_360,c_fill/v1/samples/sea-turtle.jpg',
            category: 'E-Commerce',
            technologies: ['Next.js', 'Stripe', 'Prisma', 'Vercel'],
            duration: 200,
            views: 1100,
            featured: false,
        },
        {
            id: '6',
            title: 'SaaS Analytics',
            description: 'Business intelligence dashboard for SaaS metrics.',
            videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/samples/cld-sample-video.mp4',
            thumbnailUrl: 'https://res.cloudinary.com/demo/video/upload/so_0,w_640,h_360,c_fill/v1/samples/cld-sample-video.jpg',
            category: 'SaaS',
            technologies: ['React', 'D3.js', 'Node.js', 'TimescaleDB'],
            duration: 180,
            views: 756,
            featured: false,
        },
    ]
}
