import { useState } from 'react'

// Category color mapping
const categoryStyles = {
    ERP: 'category-erp',
    CRM: 'category-crm',
    Admin: 'category-admin',
    Tracking: 'category-tracking',
    'E-Commerce': 'category-ecommerce',
    SaaS: 'category-saas',
    Other: 'tag',
}

// Format duration from seconds to mm:ss
const formatDuration = (seconds) => {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Format view count
const formatViews = (views) => {
    if (!views) return '0 views'
    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M views`
    }
    if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K views`
    }
    return `${views} views`
}

export default function VideoCard({ video, onClick, featured = false }) {
    const [isHovered, setIsHovered] = useState(false)
    const [imageError, setImageError] = useState(false)

    const placeholderImage = `data:image/svg+xml;base64,${btoa(`
    <svg width="640" height="360" viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="640" height="360" fill="#1a1a25"/>
      <circle cx="320" cy="180" r="40" fill="#7c3aed"/>
      <path d="M305 155 L355 180 L305 205 Z" fill="white"/>
    </svg>
  `)}`

    return (
        <div
            className={`project-card cursor-pointer group ${featured ? 'lg:col-span-2' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick(video)}
        >
            {/* Video Thumbnail */}
            <div className="video-thumbnail mb-4">
                <img
                    src={imageError ? placeholderImage : (video.thumbnailUrl || placeholderImage)}
                    alt={video.title}
                    className={`transform transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                    onError={() => setImageError(true)}
                />

                {/* Play Overlay */}
                <div className="video-overlay">
                    <div className="play-button">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>

                {/* Duration Badge */}
                {video.duration > 0 && (
                    <div className="video-duration">
                        {formatDuration(video.duration)}
                    </div>
                )}

                {/* Featured Badge */}
                {video.featured && (
                    <div className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-gradient-primary rounded-md text-white">
                        Featured
                    </div>
                )}
            </div>

            {/* Video Info */}
            <div className="space-y-3">
                {/* Category Badge */}
                {video.category && (
                    <span className={categoryStyles[video.category] || 'tag'}>
                        {video.category}
                    </span>
                )}

                {/* Title */}
                <h3 className={`font-bold text-white group-hover:text-primary-400 transition-colors ${featured ? 'text-xl' : 'text-lg'
                    }`}>
                    {video.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm line-clamp-2">
                    {featured ? video.businessDescription || video.description : video.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                    {video.technologies?.slice(0, featured ? 6 : 4).map((tech, index) => (
                        <span key={index} className="tag text-xs">
                            {tech}
                        </span>
                    ))}
                    {video.technologies?.length > (featured ? 6 : 4) && (
                        <span className="tag text-xs">
                            +{video.technologies.length - (featured ? 6 : 4)}
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="video-views">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                        {formatViews(video.views)}
                    </span>

                    <div className="flex gap-2">
                        {video.demoUrl && (
                            <a
                                href={video.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-dark-tertiary hover:bg-primary-700/20 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                                title="Live Demo"
                            >
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        )}
                        {video.githubUrl && (
                            <a
                                href={video.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-dark-tertiary hover:bg-primary-700/20 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                                title="GitHub"
                            >
                                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
