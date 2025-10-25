import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Head from 'next/head'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/messages`
        : '/api/admin/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        setError('Failed to load messages')
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
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Messages - Admin</title>
        <meta name="description" content="View contact form messages" />
      </Head>
      
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            <p className="mt-2 text-gray-600">View and manage contact form submissions</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-4">Contact form messages will appear here when visitors submit them</p>
              <div className="text-sm text-gray-500">
                <p>Messages are currently stored in server logs.</p>
                <p>In production, consider integrating with a database or email service.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{message.name}</h3>
                      <p className="text-sm text-gray-600">{message.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(message.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Card */}
          <div className="mt-8 card bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Message Storage</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Currently, contact form messages are logged to the server console. To implement persistent storage:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Add a database (MongoDB, PostgreSQL, etc.)</li>
                    <li>Store messages in the database instead of just logging</li>
                    <li>Add email notifications for new messages</li>
                    <li>Implement message status tracking (read/unread)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
