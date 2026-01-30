/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || ''
  },
  // Ensure proper static export configuration
  distDir: 'out',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Rewrites for development mode to proxy API requests to backend
  async rewrites() {
    // Only apply rewrites in development
    if (process.env.NODE_ENV === 'production') {
      return []
    }
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  }
}

module.exports = nextConfig
