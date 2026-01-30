import { useEffect, useCallback } from 'react'

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
                className="video-modal-content animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                    aria-label="Close video"
                >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Video Player */}
                <video
                    src={video.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    poster={video.thumbnailUrl}
                >
                    Your browser does not support the video tag.
                </video>

                {/* Video Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                    <p className="text-slate-300 text-sm mb-3">{video.description}</p>

                    <div className="flex flex-wrap gap-2">
                        {video.technologies?.map((tech, index) => (
                            <span key={index} className="tag text-xs">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
