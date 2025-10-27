const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured =
  !!cloudinaryCloudName &&
  !!cloudinaryApiKey &&
  !!cloudinaryApiSecret;

let storage;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    secure: true,



  });

  storage = new CloudinaryStorage({
    cloudinary,
    params:  {
      folder: cloudinaryFolder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    },
  });

  console.log('✅ Cloudinary storage active');
  console.log('Cloudinary configured:', {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key ? '✅ loaded' : '❌ missing',
  });
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
  cloudinaryFolder,
};