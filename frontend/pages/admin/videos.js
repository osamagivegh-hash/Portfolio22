import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'

const categories = ['ERP', 'CRM', 'Admin', 'Tracking', 'E-Commerce', 'SaaS', 'Other']

export default function AdminVideos() {
    const router = useRouter()
    const [videos, setVideos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [showUploadForm, setShowUploadForm] = useState(false)
    const [editingVideo, setEditingVideo] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other',
        technologies: '',
        businessDescription: '',
        demoUrl: '',
        githubUrl: '',
        featured: false,
        video: null,
    })

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            router.push('/admin/login')
        }
    }, [router])

    // Fetch videos
    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        try {
            const response = await fetch('/api/videos')
            if (response.ok) {
                const data = await response.json()
                setVideos(data)
            }
        } catch (err) {
            console.error('Error fetching videos:', err)
            setError('Failed to load videos')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target
        if (type === 'file') {
            setFormData(prev => ({ ...prev, video: files[0] }))
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsUploading(true)
        setError(null)
        setSuccess(null)
        setUploadProgress(0)

        try {
            const token = localStorage.getItem('adminToken')

            if (editingVideo) {
                // Update existing video
                const response = await fetch(`/api/videos/${editingVideo.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: formData.title,
                        description: formData.description,
                        category: formData.category,
                        technologies: formData.technologies,
                        businessDescription: formData.businessDescription,
                        demoUrl: formData.demoUrl,
                        githubUrl: formData.githubUrl,
                        featured: formData.featured,
                    }),
                })

                if (!response.ok) {
                    throw new Error('Failed to update video')
                }

                setSuccess('Video updated successfully!')
            } else {
                // Upload new video
                if (!formData.video) {
                    throw new Error('Please select a video file')
                }

                const uploadData = new FormData()
                uploadData.append('video', formData.video)
                uploadData.append('title', formData.title)
                uploadData.append('description', formData.description)
                uploadData.append('category', formData.category)
                uploadData.append('technologies', formData.technologies)
                uploadData.append('businessDescription', formData.businessDescription)
                uploadData.append('demoUrl', formData.demoUrl)
                uploadData.append('githubUrl', formData.githubUrl)
                uploadData.append('featured', formData.featured)

                // Simulate progress (actual progress would require XHR)
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(progressInterval)
                            return 90
                        }
                        return prev + 10
                    })
                }, 500)

                const response = await fetch('/api/videos/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: uploadData,
                })

                clearInterval(progressInterval)

                if (!response.ok) {
                    const data = await response.json()
                    throw new Error(data.error || 'Failed to upload video')
                }

                setUploadProgress(100)
                setSuccess('Video uploaded successfully!')
            }

            // Reset form and refresh
            resetForm()
            fetchVideos()
        } catch (err) {
            console.error('Upload error:', err)
            setError(err.message)
        } finally {
            setIsUploading(false)
        }
    }

    const handleEdit = (video) => {
        setEditingVideo(video)
        setFormData({
            title: video.title,
            description: video.description,
            category: video.category,
            technologies: video.technologies?.join(', ') || '',
            businessDescription: video.businessDescription || '',
            demoUrl: video.demoUrl || '',
            githubUrl: video.githubUrl || '',
            featured: video.featured,
            video: null,
        })
        setShowUploadForm(true)
    }

    const handleDelete = async (videoId) => {
        if (!confirm('Are you sure you want to delete this video?')) return

        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch(`/api/videos/${videoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error('Failed to delete video')
            }

            setSuccess('Video deleted successfully!')
            fetchVideos()
        } catch (err) {
            setError(err.message)
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'Other',
            technologies: '',
            businessDescription: '',
            demoUrl: '',
            githubUrl: '',
            featured: false,
            video: null,
        })
        setShowUploadForm(false)
        setEditingVideo(null)
        setUploadProgress(0)
    }

    return (
        <>
            <Head>
                <title>Video Management - Admin</title>
            </Head>

            <AdminLayout>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Video Management</h1>
                            <p className="text-slate-400">Upload and manage project demo videos</p>
                        </div>
                        <button
                            onClick={() => {
                                if (showUploadForm) {
                                    resetForm()
                                } else {
                                    setShowUploadForm(true)
                                }
                            }}
                            className={showUploadForm ? 'btn-ghost' : 'btn-primary'}
                        >
                            {showUploadForm ? 'Cancel' : '+ Upload Video'}
                        </button>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
                            {success}
                        </div>
                    )}

                    {/* Upload Form */}
                    {showUploadForm && (
                        <div className="card mb-8">
                            <h2 className="text-xl font-bold text-white mb-6">
                                {editingVideo ? 'Edit Video' : 'Upload New Video'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                            placeholder="ERP System Demo"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Short Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={2}
                                        className="input-field"
                                        placeholder="Brief description of the project"
                                    />
                                </div>

                                {/* Business Description */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Business Description
                                    </label>
                                    <textarea
                                        name="businessDescription"
                                        value={formData.businessDescription}
                                        onChange={handleChange}
                                        rows={3}
                                        className="input-field"
                                        placeholder="Detailed business explanation for enterprise demos..."
                                    />
                                </div>

                                {/* Technologies */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Technologies (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="technologies"
                                        value={formData.technologies}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="React, Node.js, PostgreSQL, Docker"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Demo URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Live Demo URL
                                        </label>
                                        <input
                                            type="url"
                                            name="demoUrl"
                                            value={formData.demoUrl}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="https://demo.example.com"
                                        />
                                    </div>

                                    {/* GitHub URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            GitHub URL
                                        </label>
                                        <input
                                            type="url"
                                            name="githubUrl"
                                            value={formData.githubUrl}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                </div>

                                {/* Video File */}
                                {!editingVideo && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Video File * (mp4, webm, mov - max 100MB)
                                        </label>
                                        <input
                                            type="file"
                                            name="video"
                                            accept="video/mp4,video/webm,video/quicktime"
                                            onChange={handleChange}
                                            required={!editingVideo}
                                            className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                                        />
                                    </div>
                                )}

                                {/* Featured */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        id="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-slate-600 bg-dark-tertiary text-primary-600 focus:ring-primary-500"
                                    />
                                    <label htmlFor="featured" className="text-slate-300">
                                        Featured video (will appear prominently in the gallery)
                                    </label>
                                </div>

                                {/* Upload Progress */}
                                {isUploading && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Uploading to Cloudinary...</span>
                                            <span className="text-primary-400">{uploadProgress}%</span>
                                        </div>
                                        <div className="h-2 bg-dark-tertiary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-primary transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Submit */}
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="btn-primary disabled:opacity-50"
                                    >
                                        {isUploading ? 'Uploading...' : (editingVideo ? 'Save Changes' : 'Upload Video')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Videos Grid */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="spinner mx-auto mb-4"></div>
                            <p className="text-slate-400">Loading videos...</p>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-tertiary flex items-center justify-center">
                                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-white font-medium mb-2">No videos yet</p>
                            <p className="text-slate-400 mb-4">Upload your first project demo video</p>
                            <button
                                onClick={() => setShowUploadForm(true)}
                                className="btn-primary"
                            >
                                Upload Video
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map(video => (
                                <div key={video.id} className="card group">
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-dark-tertiary">
                                        {video.thumbnailUrl ? (
                                            <img
                                                src={video.thumbnailUrl}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-12 h-12 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Featured Badge */}
                                        {video.featured && (
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600 rounded text-xs text-white font-medium">
                                                Featured
                                            </div>
                                        )}

                                        {/* Category */}
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                                            {video.category}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <h3 className="font-bold text-white mb-2 line-clamp-1">{video.title}</h3>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{video.description}</p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(video)}
                                            className="btn-ghost text-sm flex-1"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(video.id)}
                                            className="btn-ghost text-sm text-red-400 hover:bg-red-500/10 flex-1"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AdminLayout>
        </>
    )
}
