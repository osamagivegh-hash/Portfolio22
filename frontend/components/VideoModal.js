import { useEffect, useCallback } from 'react'

// Format duration from seconds to mm:ss
const formatDuration = (seconds) => {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function VideoModal({ video, isOpen, onClose }) {
    // Handle ESC key to close modal
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }, [onClose])

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, handleKeyDown])

    if (!isOpen || !video) return null

    return (
        <div
            className="video-modal-backdrop animate-fade-in"
            onClick={onClose}
        >
            <div
                className="video-modal-content animate-fade-in max-w-6xl w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors z-10"
                    aria-label="Close video"
                >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="bg-dark-secondary rounded-xl overflow-hidden">
                    {/* Video Player */}
                    <div className="aspect-video bg-black">
                        <video
                            src={video.videoUrl}
                            controls
                            autoPlay
                            className="w-full h-full"
                            poster={video.thumbnailUrl || video.videoThumbnailUrl}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Video Details */}
                    <div className="p-6 space-y-4">
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    {video.category && (
                                        <span className={`category-${video.category.toLowerCase().replace('-', '')} text-xs`}>
                                            {video.category}
                                        </span>
                                    )}
                                    {video.featured && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-gradient-primary rounded text-white">
                                            Featured
                                        </span>
                                    )}
                                    {video.duration > 0 && (
                                        <span className="text-slate-500 text-sm">
                                            {formatDuration(video.duration)}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-white">{video.title}</h3>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {video.demoUrl && (
                                    <a
                                        href={video.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Live Demo
                                    </a>
                                )}
                                {video.githubUrl && (
                                    <a
                                        href={video.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        GitHub
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <p className="text-slate-300">{video.description}</p>
                            {video.businessDescription && video.businessDescription !== video.description && (
                                <p className="text-slate-400 text-sm">{video.businessDescription}</p>
                            )}
                        </div>

                        {/* Technologies */}
                        {video.technologies && video.technologies.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-2">Technologies Used</h4>
                                <div className="flex flex-wrap gap-2">
                                    {video.technologies.map((tech, index) => (
                                        <span key={index} className="tag">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 pt-4 border-t border-white/5 text-sm text-slate-500">
                            {video.views !== undefined && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                    </svg>
                                    {video.views} views
                                </span>
                            )}
                            {video.createdAt && (
                                <span>
                                    Added {new Date(video.createdAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
