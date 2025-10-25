import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Head from 'next/head'

export default function AdminProfile() {
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    github: '',
    linkedin: '',
    profileImage: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || '')}/api/admin/portfolio`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.profile)
      } else {
        setError('Failed to load profile data')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || '')}/api/admin/portfolio/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        setMessage('Profile updated successfully!')
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to update profile')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || '')}/api/admin/portfolio/profile/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setProfileData({
          ...profileData,
          profileImage: result.imageUrl
        })
        setMessage('Profile image updated successfully!')
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to upload image')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Profile Management - Admin</title>
        <meta name="description" content="Manage your profile information" />
      </Head>
      
      <AdminLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
            <p className="mt-2 text-gray-600">Update your personal information and profile image</p>
          </div>

          {message && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Image */}
            <div className="lg:col-span-1">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Image</h2>
                <div className="text-center">
                  <img
                    src={profileData.profileImage || '/profile.jpg'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjY0IiBjeT0iNDgiIHI9IjE2IiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0zMiA5NkMzMiA4MC41MzYgNDQuNTM2IDY4IDYwIDY4SDY4QzgzLjQ2NCA2OCA5NiA4MC41MzYgOTYgOTZWMTA0SDMyVjk2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="btn-secondary cursor-pointer inline-block"
                  >
                    Upload New Image
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={profileData.title}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Your job title"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Bio *
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="input-field resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        id="github"
                        name="github"
                        value={profileData.github}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        value={profileData.linkedin}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
