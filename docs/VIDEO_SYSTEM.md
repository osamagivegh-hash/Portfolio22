# Portfolio Video System Documentation

## Overview

This document explains how video uploads work with Cloudinary, how to add new projects with video demos, and how the project structure is organized.

## Table of Contents

1. [Video Upload System](#video-upload-system)
2. [Adding New Projects with Videos](#adding-new-projects-with-videos)
3. [Project Structure](#project-structure)
4. [API Reference](#api-reference)
5. [Data Models](#data-models)

---

## Video Upload System

### How It Works

The portfolio uses **Cloudinary** for all video storage. Videos are uploaded through the admin panel and stored directly in Cloudinary - no local file storage is used.

### Upload Flow

1. **User selects video file** in the admin panel (`/admin/videos`)
2. **Frontend sends video** to the backend via multipart form data
3. **Backend uploads to Cloudinary** using the Cloudinary SDK
4. **Cloudinary returns** the video URL and public ID
5. **Thumbnail is auto-generated** from the video
6. **Metadata is saved** to MongoDB

### Supported Formats

- **MP4** (recommended)
- **WebM**
- **MOV**
- Maximum file size: **100MB**

### Cloudinary Configuration

Environment variables (already configured in `.env`):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Thumbnail Generation

Cloudinary automatically generates thumbnails from uploaded videos. The thumbnail URL is created using:

```javascript
cloudinary.url(publicId, {
  resource_type: 'video',
  format: 'jpg',
  transformation: [
    { width: 640, height: 360, crop: 'fill' },
    { start_offset: '0' }  // Take frame at 0 seconds
  ]
});
```

---

## Adding New Projects with Videos

### Method 1: Admin Panel (Recommended)

1. Navigate to `/admin/videos`
2. Click **"+ Upload Video"**
3. Fill in the form:
   - **Title**: Project name
   - **Category**: ERP, CRM, Admin, Tracking, E-Commerce, SaaS, or Other
   - **Description**: Brief description
   - **Business Description**: Detailed enterprise explanation
   - **Technologies**: Comma-separated tech stack
   - **Video File**: Select MP4/WebM/MOV file
   - **Featured**: Check to highlight in gallery
4. Click **"Upload Video"**

### Method 2: API (Programmatic)

```javascript
// POST /api/videos/upload
const formData = new FormData();
formData.append('video', videoFile);
formData.append('title', 'ERP System Demo');
formData.append('description', 'Enterprise resource planning system');
formData.append('category', 'ERP');
formData.append('technologies', 'React, Node.js, PostgreSQL');
formData.append('businessDescription', 'Complete ERP solution for enterprises...');
formData.append('featured', 'true');

const response = await fetch('/api/videos/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  },
  body: formData
});
```

### Method 3: Adding Video to Existing Project

Projects can also have embedded videos. Update a project via the admin panel or API:

```javascript
// PUT /api/admin/portfolio/projects/:id
{
  "hasVideo": true,
  "videoUrl": "https://res.cloudinary.com/...",
  "videoPublicId": "portfolio_videos/...",
  "videoThumbnailUrl": "https://res.cloudinary.com/..."
}
```

---

## Project Structure

```
Portfolio22/
├── backend/
│   ├── server.js              # Express server with all routes
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── storage.js         # Cloudinary configuration
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── models/
│   │   ├── Video.js           # Video schema (NEW)
│   │   ├── Project.js         # Project schema (updated)
│   │   ├── Profile.js         # Profile schema
│   │   ├── Skill.js           # Skill schema
│   │   ├── Message.js         # Contact message schema
│   │   └── User.js            # Admin user schema
│   └── routes/
│       ├── admin.js           # Admin API endpoints
│       └── videos.js          # Video API endpoints (NEW)
│
├── frontend/
│   ├── components/
│   │   ├── Layout.js          # Main dark theme layout
│   │   ├── AdminLayout.js     # Admin dashboard layout
│   │   ├── VideoCard.js       # Video gallery card (NEW)
│   │   └── VideoModal.js      # Video player modal (NEW)
│   ├── pages/
│   │   ├── index.js           # Home page (updated)
│   │   ├── projects.js        # Projects page (updated)
│   │   ├── gallery.js         # Video gallery page (NEW)
│   │   ├── contact.js         # Contact page (updated)
│   │   └── admin/
│   │       ├── videos.js      # Video management (NEW)
│   │       ├── projects.js    # Project management
│   │       └── ...
│   ├── styles/
│   │   └── globals.css        # Dark theme CSS (updated)
│   └── tailwind.config.js     # Tailwind configuration (updated)
│
└── docs/
    └── VIDEO_SYSTEM.md        # This documentation
```

---

## API Reference

### Video Endpoints

#### Get All Videos (Public)
```
GET /api/videos
Query params:
  - category: Filter by category (optional)
  - featured: true/false (optional)
  - limit: Number of results (default: 50)
```

#### Get Single Video (Public)
```
GET /api/videos/:id
```

#### Increment View Count
```
POST /api/videos/:id/view
```

#### Upload Video (Admin)
```
POST /api/videos/upload
Headers: Authorization: Bearer <token>
Body: multipart/form-data
  - video: File
  - title: String (required)
  - description: String (required)
  - category: String
  - technologies: String (comma-separated)
  - businessDescription: String
  - demoUrl: String
  - githubUrl: String
  - featured: Boolean
```

#### Update Video (Admin)
```
PUT /api/videos/:id
Headers: Authorization: Bearer <token>
Body: JSON with fields to update
```

#### Delete Video (Admin)
```
DELETE /api/videos/:id
Headers: Authorization: Bearer <token>
```

---

## Data Models

### Video Model

```javascript
{
  title: String,           // Required
  description: String,     // Required
  videoUrl: String,        // Cloudinary URL
  videoPublicId: String,   // Cloudinary public ID
  thumbnailUrl: String,    // Auto-generated thumbnail
  category: String,        // ERP, CRM, Admin, Tracking, E-Commerce, SaaS, Other
  technologies: [String],  // Tech stack array
  duration: Number,        // Duration in seconds
  format: String,          // mp4, webm, mov
  businessDescription: String,  // Enterprise explanation
  demoUrl: String,         // Live demo link
  githubUrl: String,       // Repository link
  featured: Boolean,       // Highlight in gallery
  views: Number,           // View counter
  order: Number,           // Display order
  projectId: ObjectId,     // Optional link to Project
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model (Updated)

```javascript
{
  title: String,           // Required
  description: String,     // Required
  businessDescription: String,  // NEW: Enterprise explanation
  technologies: [String],
  category: String,        // NEW: ERP, CRM, Admin, etc.
  github: String,
  demo: String,
  featured: Boolean,
  image: String,
  imagePublicId: String,
  hasVideo: Boolean,       // NEW: Has video demo
  videoUrl: String,        // NEW: Cloudinary video URL
  videoPublicId: String,   // NEW: Video public ID
  videoThumbnailUrl: String, // NEW: Video thumbnail
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Categories

Projects and videos are organized into these categories:

| Category | Use Case |
|----------|----------|
| **ERP** | Enterprise Resource Planning systems |
| **CRM** | Customer Relationship Management |
| **Admin** | Administrative dashboards and panels |
| **Tracking** | Inventory, store, or asset tracking |
| **E-Commerce** | Online stores and marketplaces |
| **SaaS** | Software as a Service applications |
| **Other** | Miscellaneous projects |

---

## Best Practices

### Video Uploads
- Compress videos before upload (aim for 720p or 1080p)
- Use MP4 with H.264 codec for best compatibility
- Keep videos under 2-3 minutes for demos
- Add a clear title frame at the start for thumbnails

### Project Descriptions
- Write business-focused descriptions for enterprise demos
- List specific features and benefits
- Include measurable outcomes when possible
- Use professional language for corporate clients

### Tech Stack Tags
- List only the main technologies (4-6 items)
- Start with frontend frameworks, then backend
- Include databases and key services
- Order by importance/relevance

---

## Troubleshooting

### Video Upload Fails
1. Check Cloudinary credentials in `.env`
2. Ensure file size is under 100MB
3. Verify file format is MP4, WebM, or MOV
4. Check backend logs for specific errors

### Thumbnails Not Showing
1. Wait a few seconds after upload (Cloudinary processing)
2. Verify the video file is valid
3. Check the `thumbnailUrl` in database

### Videos Not Playing
1. Check browser console for CORS errors
2. Verify Cloudinary URL is accessible
3. Test video URL directly in browser

---

## Security Notes

1. All video uploads require admin authentication
2. Cloudinary API keys are server-side only
3. Video URLs are public (consider signed URLs for private content)
4. File size and type validation prevents most attack vectors
5. Use environment variables for all secrets

---

## Future Expansion

The data model supports easy expansion:

- **Multiple video per project**: Use `projectId` reference
- **Video playlists**: Add playlist model with video references
- **Private videos**: Add `isPublic` field and signed URLs
- **Video analytics**: Extend `views` to track watch time
- **Comments/Reactions**: Add related models
