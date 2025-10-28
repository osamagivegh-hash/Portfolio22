import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Head from 'next/head'

export default function AdminAnalytics() {
  const [visualizations, setVisualizations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [uploadingVisualization, setUploadingVisualization] = useState(null)

  // Define the visualizations that can be managed
  const visualizationTypes = [
    {
      id: 'time-series',
      name: 'Time Series Analysis',
      description: 'Sales trends over time',
      placeholder: '📈 Time Series Sales Chart'
    },
    {
      id: 'grouped-bar',
      name: 'Sales by Region and Product Category',
      description: 'Grouped bar chart showing sales distribution',
      placeholder: '📊 Grouped Bar Chart'
    },
    {
      id: 'distribution',
      name: 'Distribution Analysis',
      description: 'Statistical distribution charts',
      placeholder: '📈 Distribution Charts'
    },
    {
      id: 'scatter',
      name: 'Income vs Sales Correlation',
      description: 'Scatter plot showing correlation',
      placeholder: '🔗 Scatter Plot'
    },
    {
      id: 'heatmap',
      name: 'Correlation Heatmap',
      description: 'Heatmap showing variable correlations',
      placeholder: '🔥 Correlation Heatmap'
    },
    {
      id: 'segments',
      name: 'Customer Segments by Region',
      description: 'Customer segmentation analysis',
      placeholder: '👥 Customer Segments'
    },
    {
      id: 'pie',
      name: 'Product Category Distribution',
      description: 'Pie chart showing product distribution',
      placeholder: '🥧 Pie Chart'
    },
    {
      id: 'multi-axis',
      name: 'Sales vs Profit Over Time',
      description: 'Multi-axis chart comparison',
      placeholder: '📊 Multi-Axis Chart'
    }
  ]

  useEffect(() => {
    fetchVisualizations()
  }, [])

  const fetchVisualizations = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/visualizations`
        : '/api/admin/analytics/visualizations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setVisualizations(data)
      } else {
        setError('Failed to load visualizations')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (visualizationId, file) => {
    if (!file) return

    setUploadingVisualization(visualizationId)
    setMessage('')
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('visualizationId', visualizationId)
      formData.append('reportType', 'data_analytics')

      const token = localStorage.getItem('adminToken')
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/visualization/save`
        : '/api/admin/visualization/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        const updatedVisualization = result.visualization || {
          id: visualizationId,
          visualizationId,
          reportType: 'data_analytics',
          imageUrl: result.imageUrl,
          imagePublicId: result.imagePublicId
        }
        
        setMessage(`✅ ${visualizationTypes.find(v => v.id === visualizationId)?.name} updated successfully!`)
        
        // Update the visualization in state (insert if missing)
        setVisualizations(prev => {
          const exists = prev.some(v => (v.id || v.visualizationId) === visualizationId)
          if (exists) {
            return prev.map(v => 
              (v.id || v.visualizationId) === visualizationId 
                ? { ...v, ...updatedVisualization }
                : v
            )
          }
          return [...prev, updatedVisualization]
        })
      } else {
        setError('Failed to upload visualization')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setUploadingVisualization(null)
    }
  }

  const getVisualizationImage = (visualizationId) => {
    const visualization = visualizations.find(v => (v.id || v.visualizationId) === visualizationId)
    return visualization?.imageUrl || null
  }

  const getVisualizationType = (visualizationId) => {
    return visualizationTypes.find(v => v.id === visualizationId)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Analytics Management - Admin Dashboard</title>
      </Head>
      
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Data Analytics Report Management
            </h1>
            <p className="text-gray-600">
              Manage visualizations for the Data Analytics Dashboard report
            </p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visualizationTypes.map((viz) => {
              const currentImage = getVisualizationImage(viz.id)
              const isUploading = uploadingVisualization === viz.id
              
              return (
                <div key={viz.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {viz.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {viz.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {currentImage ? (
                        <img 
                          src={currentImage} 
                          alt={viz.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <div className="text-4xl mb-2">{viz.placeholder}</div>
                          <div className="text-sm">No image uploaded</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="file"
                      id={`upload-${viz.id}`}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          handleImageUpload(viz.id, file)
                        }
                      }}
                      className="hidden"
                    />
                    
                    <label
                      htmlFor={`upload-${viz.id}`}
                      className={`w-full block text-center py-2 px-4 rounded-md cursor-pointer transition-colors ${
                        isUploading 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {isUploading ? 'Uploading...' : (currentImage ? 'Update Image' : 'Upload Image')}
                    </label>

                    {currentImage && (
                      <button
                        onClick={() => {
                          // Remove image functionality could be added here
                          setMessage(`Image removed for ${viz.name}`)
                        }}
                        className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              📊 Preview Report
            </h3>
            <p className="text-blue-700 mb-4">
              View how your visualizations appear in the public report
            </p>
            <a
              href="/reports/data_analytics_report.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Open Report Preview
            </a>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
