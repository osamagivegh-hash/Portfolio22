import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Head from 'next/head'
import Link from 'next/link'

export default function AdminDashboard() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPortfolioData()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/portfolio`
        : '/api/admin/portfolio'
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPortfolioData(data)
      } else {
        setError('Failed to load portfolio data')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const stats = [
    {
      name: 'Total Projects',
      value: portfolioData?.projects?.length || 0,
      icon: '💼',
      color: 'bg-blue-500'
    },
    {
      name: 'Featured Projects',
      value: portfolioData?.projects?.filter(p => p.featured)?.length || 0,
      icon: '⭐',
      color: 'bg-yellow-500'
    },
    {
      name: 'Skills',
      value: portfolioData?.skills?.length || 0,
      icon: '🛠️',
      color: 'bg-green-500'
    },
    {
      name: 'Contact Messages',
      value: 0, // This would come from a database in production
      icon: '💬',
      color: 'bg-purple-500'
    }
  ]

  return (
    <>
      <Head>
        <title>Admin Dashboard - Portfolio</title>
        <meta name="description" content="Admin dashboard for portfolio management" />
      </Head>
      
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your portfolio content and settings</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="card">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color} text-white text-2xl`}>
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Overview */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Overview</h2>
              {portfolioData?.profile && (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <p className="text-gray-900">{portfolioData.profile.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Title:</span>
                    <p className="text-gray-900">{portfolioData.profile.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{portfolioData.profile.email}</p>
                  </div>
                  <Link href="/admin/profile" className="btn-primary inline-block">
                    Edit Profile
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Projects */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Projects</h2>
              {portfolioData?.projects?.slice(0, 3).map((project) => (
                <div key={project.id} className="border-b border-gray-200 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.description.substring(0, 100)}...</p>
                  <div className="flex items-center mt-2">
                    {project.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                        Featured
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {project.technologies?.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
              <Link href="/admin/projects" className="btn-secondary inline-block mt-4">
                Manage All Projects
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/projects" className="card hover:shadow-lg transition-shadow duration-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">💼</div>
                  <h3 className="font-medium text-gray-900">Manage Projects</h3>
                  <p className="text-sm text-gray-600">Add, edit, or delete projects</p>
                </div>
              </Link>
              
              <Link href="/admin/profile" className="card hover:shadow-lg transition-shadow duration-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">👤</div>
                  <h3 className="font-medium text-gray-900">Edit Profile</h3>
                  <p className="text-sm text-gray-600">Update personal information</p>
                </div>
              </Link>
              
              <Link href="/admin/skills" className="card hover:shadow-lg transition-shadow duration-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">🛠️</div>
                  <h3 className="font-medium text-gray-900">Manage Skills</h3>
                  <p className="text-sm text-gray-600">Update skills and technologies</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
