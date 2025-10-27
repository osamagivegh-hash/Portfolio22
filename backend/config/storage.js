const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

let storage;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'portfolio_uploads',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      resource_type: 'image',
      overwrite: false,
    },
    filename: (req, file, cb) => {
      // Generate a unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const base = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9-_]/g, '_');
      cb(null, `${base}_${uniqueSuffix}`);
    },
  });

  console.log('✅ Cloudinary storage active');
} else {
  // Local fallback for dev only (ephemeral in many hosts; fine for local dev)
  const localDir = path.join(__dirname, '../../frontend/public/uploads');
  if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, localDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9-_]/g, '_');
      cb(null, `${Date.now()}_${base}${ext}`);
    },
  });

  console.log('⚠️ Cloudinary not configured — using local uploads at /public/uploads');
}

module.exports = {
  storage,
  cloudinary: isCloudinaryConfigured ? cloudinary : null,
  isCloudinaryConfigured,
};