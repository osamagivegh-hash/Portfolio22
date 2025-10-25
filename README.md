# Personal Portfolio Website

A full-stack personal portfolio website built with **Next.js** (frontend) and **Express.js** (backend), designed to be deployed as a single web service on Render.

## 🚀 Features

- **Modern Frontend**: Built with Next.js and React, styled with Tailwind CSS
- **Backend API**: Express.js server with contact form endpoint
- **Static Export**: Next.js static export served by Express
- **Single Deployment**: Both frontend and backend deployed as one service
- **Production Ready**: Includes security headers, compression, and CORS handling

## 📁 Project Structure

```
Portfolio22/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables example
├── frontend/
│   ├── pages/             # Next.js pages
│   │   ├── index.js       # Home page
│   │   ├── projects.js    # Projects page
│   │   └── contact.js     # Contact page
│   ├── components/        # React components
│   ├── styles/            # Global styles
│   ├── public/            # Static assets
│   ├── next.config.js     # Next.js configuration
│   └── package.json       # Frontend dependencies
└── README.md
```

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Portfolio22
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Build the frontend**
```bash
npm run build
```

5. **Start the backend server**
```bash
cd ../backend
npm start
```

6. **Access the application**
Open your browser and navigate to `http://localhost:5000`

## 🌐 Deploying to Render

### Step 1: Prepare Your Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Make sure all files are committed

### Step 2: Create a Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your repository

### Step 3: Configure the Web Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `portfolio-website` (or your preferred name)
- **Region**: Choose the closest region to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (use project root)
- **Runtime**: `Node`

**Build & Deploy Settings:**
- **Build Command**:
```bash
npm run build
```

- **Start Command**:
```bash
npm start
```

**Environment Variables:**
- `NODE_ENV` = `production`
- `PORT` = `10000` (Render will set this automatically)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your application
3. Once deployed, you'll receive a URL like: `https://your-app-name.onrender.com`

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
```

### Frontend
The frontend uses `NEXT_PUBLIC_API_URL` which is automatically set based on the environment:
- **Development**: `http://localhost:5000`
- **Production**: Same domain (no CORS needed)

## 📝 API Endpoints

### GET /api/test
Test endpoint to verify backend is working.

**Response:**
```json
{
  "message": "Backend is working correctly"
}
```

### POST /api/contact
Submit contact form data.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to work with you!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your message! I will get back to you soon."
}
```

## 🎨 Customization

### Update Personal Information

1. **Home Page** (`frontend/pages/index.js`):
   - Change name, job title, and bio
   - Update profile photo (add to `frontend/public/`)
   - Modify social media links

2. **Projects Page** (`frontend/pages/projects.js`):
   - Add/remove projects
   - Update project descriptions and technologies
   - Add project images to `frontend/public/`

3. **Contact Page** (`frontend/pages/contact.js`):
   - Update contact information
   - Modify social media links

### Styling

The project uses Tailwind CSS. Customize colors and styles in:
- `frontend/tailwind.config.js` - Theme configuration
- `frontend/styles/globals.css` - Global styles and custom classes

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configured for same-origin in production
- **Compression**: Gzip compression for responses
- **Input Validation**: Form validation on contact endpoint

## 🐛 Troubleshooting

### Build fails on Render
- Check that all dependencies are listed in `package.json`
- Verify build command is correct
- Check Render build logs for specific errors

### Contact form not working
- Verify API URL is correct
- Check browser console for errors
- Ensure backend is running and accessible

### Static files not loading
- Verify frontend build completed successfully
- Check that `frontend/out` directory exists
- Ensure backend is serving from correct path

## 📦 Dependencies

### Backend
- express - Web framework
- helmet - Security headers
- cors - CORS handling
- compression - Response compression
- dotenv - Environment variables

### Frontend
- next - React framework
- react - UI library
- tailwindcss - Utility-first CSS framework

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📧 Support

If you have any questions or need help with deployment, feel free to open an issue or contact me.

---

**Built with ❤️ using Next.js and Express.js**

