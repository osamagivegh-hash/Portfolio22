import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Head from 'next/head'

export default function AdminSkills() {
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/portfolio`
        : '/api/admin/portfolio', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSkills(data.skills || [])
      } else {
        setError('Failed to load skills')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage('')
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/portfolio/skills`
        : '/api/admin/portfolio/skills'
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skills }),
      })

      if (response.ok) {
        setMessage('Skills updated successfully!')
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to update skills')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading skills...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Skills Management - Admin</title>
        <meta name="description" content="Manage your skills and technologies" />
      </Head>
      
      <AdminLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
            <p className="mt-2 text-gray-600">Manage your skills and technologies</p>
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

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Skill</h2>
            
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a skill or technology"
                className="input-field flex-1"
              />
              <button
                onClick={handleAddSkill}
                disabled={!newSkill.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Skill
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Skills ({skills.length})</h3>
              
              {skills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🛠️</div>
                  <p>No skills added yet. Add your first skill above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3"
                    >
                      <span className="text-gray-900 font-medium">{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div className="card">
              <h4 className="text-md font-medium text-gray-900 mb-4">Skills & Technologies</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="card text-center">
                    <h3 className="font-semibold text-gray-800">{skill}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
