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
      description: 'Sales trends over time'
    },
    {
      id: 'grouped-bar',
      name: 'Sales by Region and Product Category',
      description: 'Grouped bar chart showing sales distribution'
    },
    {
      id: 'distribution',
      name: 'Distribution Analysis',
      description: 'Statistical distribution charts'
    },
    {
      id: 'scatter',
      name: 'Income vs Sales Correlation',
      description: 'Scatter plot showing correlation'
    },
    {
      id: 'heatmap',
      name: 'Correlation Heatmap',
      description: 'Heatmap showing variable correlations'
    },
    {
      id: 'segments',
      name: 'Customer Segments by Region',
      description: 'Customer segmentation analysis'
    },
    {
      id: 'pie',
      name: 'Product Category Distribution',
      description: 'Pie chart showing product distribution'
    },
    {
      id: 'multi-axis',
      name: 'Sales vs Profit Over Time',
      description: 'Multi-axis chart comparison'
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
        console.log('📊 Fetched visualizations:', data)
        setVisualizations(data)
      } else {
        console.error('❌ Failed to load visualizations:', response.status, response.statusText)
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
        console.log('✅ Upload successful:', result)
        
        // Update the visualization in state
        setVisualizations(prev => {
          const exists = prev.some(v => (v.id || v.visualizationId) === visualizationId)
          if (exists) {
            return prev.map(v => 
              (v.id || v.visualizationId) === visualizationId 
                ? { ...v, imageUrl: result.imageUrl }
                : v
            )
          }
          return [...prev, {
            id: visualizationId,
            visualizationId,
            reportType: 'data_analytics',
            imageUrl: result.imageUrl,
            imagePublicId: result.imagePublicId
          }]
        })
        
        setMessage(`✅ ${visualizationTypes.find(v => v.id === visualizationId)?.name} updated successfully!`)
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
    console.log(`🔍 Looking for visualization ${visualizationId}:`, visualization)
    
    if (!visualization?.imageUrl) {
      console.log(`❌ No image found for ${visualizationId}`)
      return null
    }
    
    // Handle both relative and absolute URLs
    const imageUrl = visualization.imageUrl
    let finalUrl
    if (imageUrl.startsWith('http')) {
      finalUrl = imageUrl // Already absolute
    } else if (imageUrl.startsWith('/')) {
      finalUrl = `${window.location.origin}${imageUrl}` // Make absolute
    } else {
      finalUrl = `${window.location.origin}/${imageUrl}` // Add leading slash and make absolute
    }
    
    console.log(`🖼️ Image URL for ${visualizationId}:`, finalUrl)
    return finalUrl
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
    <AdminLayout>
      <Head>
        <title>Analytics Dashboard - Admin</title>
      </Head>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visualizationTypes.map((viz) => {
            const currentImage = getVisualizationImage(viz.id)
            const isUploading = uploadingVisualization === viz.id
            
            return (
              <div key={viz.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {viz.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {viz.description}
                  </p>
                </div>
                
                <div className="px-4 pb-4">
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                    {currentImage ? (
                      <img 
                        src={currentImage} 
                        alt={viz.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', currentImage)
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">📊</div>
                        <div className="text-sm">No image uploaded</div>
                      </div>
                    )}
                  </div>

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
                    {isUploading ? 'Uploading...' : currentImage ? 'Update Image' : 'Upload Image'}
                  </label>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}