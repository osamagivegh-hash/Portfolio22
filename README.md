# Personal Portfolio Website

A full-stack personal portfolio website built with **Next.js** (frontend) and **Express.js** (backend), featuring video demos, modern dark UI, and clean architecture. Designed for showcasing enterprise projects (ERP, CRM, Admin Systems) with video demonstrations.

## 🚀 Features

### Core Features
- **Modern Dark Theme**: Sleek, professional design with gradient accents and glassmorphism
- **Video Gallery**: Showcase project demos with Cloudinary-hosted videos
- **Video Upload System**: Secure admin panel for uploading video demos
- **Category Filtering**: Organize projects by ERP, CRM, Admin, Tracking, E-Commerce, SaaS
- **Responsive Design**: Optimized for all devices with mobile-first approach
- **Animated UI**: Smooth transitions, hover effects, and micro-animations

### Technical Features
- **Next.js 14**: React framework with SSR/SSG support
- **Express.js Backend**: RESTful API with JWT authentication
- **MongoDB**: Persistent storage with Mongoose ODM
- **Cloudinary Integration**: Cloud-based video and image storage
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Admin Dashboard**: Complete CMS for content management

## 📁 Project Structure

```
Portfolio22/
├── backend/
│   ├── server.js              # Express server
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── storage.js         # Cloudinary configuration
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── models/
│   │   ├── Video.js           # Video schema
│   │   ├── Project.js         # Project schema
│   │   ├── Profile.js         # Profile schema
│   │   ├── Skill.js           # Skill schema
│   │   ├── Message.js         # Contact message schema
│   │   └── User.js            # Admin user schema
│   └── routes/
│       ├── admin.js           # Admin API endpoints
│       └── videos.js          # Video API endpoints
│
├── frontend/
│   ├── components/
│   │   ├── Layout.js          # Main dark theme layout
│   │   ├── AdminLayout.js     # Admin dashboard layout
│   │   ├── VideoCard.js       # Video gallery card
│   │   └── VideoModal.js      # Video player modal
│   ├── pages/
│   │   ├── index.js           # Home page
│   │   ├── projects.js        # Projects page
│   │   ├── gallery.js         # Video gallery
│   │   ├── contact.js         # Contact page
│   │   └── admin/
│   │       ├── videos.js      # Video management
│   │       ├── projects.js    # Project management
│   │       └── ...
│   ├── styles/
│   │   └── globals.css        # Dark theme CSS
│   └── tailwind.config.js     # Tailwind configuration
│
├── docs/
│   └── VIDEO_SYSTEM.md        # Video system documentation
│
└── README.md
```

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Cloudinary account (for video uploads)

### Setup Instructions

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Portfolio22
```

2. **Set up environment variables**
```bash
cp backend/env.example backend/.env
```

Edit `.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Cloudinary (required for video uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Install dependencies and build**
```bash
npm run build
```

4. **Initialize the database**
```bash
cd backend
npm run init-db
```

5. **Start the development servers**

Backend:
```bash
npm run dev:backend
```

Frontend (in a new terminal):
```bash
npm run dev:frontend
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin/login

## 🎬 Video Upload System

### Uploading Videos

1. Log in to admin panel at `/admin/login`
2. Navigate to **Videos** in the sidebar
3. Click **"+ Upload Video"**
4. Fill in project details:
   - Title and description
   - Category (ERP, CRM, Admin, etc.)
   - Tech stack tags
   - Video file (MP4, WebM, MOV - max 100MB)
5. Click **Upload**

### Supported Formats
- **MP4** (recommended)
- **WebM**
- **MOV**

### How It Works
Videos are uploaded directly to Cloudinary. Thumbnails are auto-generated. Only URLs and metadata are stored in MongoDB - no local file storage.

[See full documentation →](./docs/VIDEO_SYSTEM.md)

## 🔐 Admin Dashboard

### Access
- URL: `/admin/login`
- Demo credentials: `admin` / `password`

### Features
- **Dashboard**: Overview statistics
- **Profile**: Update name, bio, social links
- **Projects**: Add/edit projects with categories
- **Videos**: Upload and manage demo videos
- **Analytics**: View visualizations
- **Skills**: Manage tech stack
- **Messages**: View contact submissions

## 🎨 Design System

### Colors
- **Background**: Dark theme (`#0a0a0f`, `#12121a`, `#1a1a25`)
- **Accent**: Purple-Cyan gradient (`#7c3aed` → `#06b6d4`)
- **Text**: White/Slate scale

### Components
- Glassmorphism cards
- Gradient buttons
- Category badges (color-coded)
- Video thumbnails with hover effects
- Animated sections

### Categories
| Category | Color |
|----------|-------|
| ERP | Yellow |
| CRM | Green |
| Admin | Red |
| Tracking | Blue |
| E-Commerce | Purple |
| SaaS | Pink |

## 🌐 Deployment

### Render

1. Push to GitHub
2. Create Web Service on Render
3. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add environment variables
5. Deploy

### Environment Variables for Production
```
NODE_ENV=production
MONGODB_URI=your_production_mongodb
JWT_SECRET=your_production_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📝 API Endpoints

### Public
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get single video
- `POST /api/videos/:id/view` - Increment view count
- `GET /api/portfolio` - Get portfolio data
- `POST /api/contact` - Submit contact form

### Admin (Requires Auth)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify token
- `POST /api/videos/upload` - Upload video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video
- `GET/POST/PUT/DELETE /api/admin/portfolio/*` - Portfolio CRUD

## 🔧 Customization

### Changing Theme Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    700: '#your-color',
    // ...
  },
  // ...
}
```

### Adding New Categories
1. Update `backend/models/Video.js` enum
2. Update `backend/models/Project.js` enum
3. Add category style in `frontend/styles/globals.css`

## 📦 Dependencies

### Backend
- express, mongoose, cloudinary
- jsonwebtoken, bcryptjs
- multer, multer-storage-cloudinary
- helmet, cors, compression

### Frontend
- next, react, react-dom
- tailwindcss, autoprefixer, postcss

## 📄 License

MIT License - Feel free to use for your own portfolio!

## 🤝 Contributing

Contributions welcome! Please fork and submit PRs.

---

**Built with ❤️ using Next.js, Express.js & Cloudinary**
