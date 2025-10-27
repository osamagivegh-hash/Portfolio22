const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// 🧩 حمل ملف البيئة (.env) من مجلد backend عند التشغيل المحلي
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
} catch (e) {
  // في Render لا حاجة لهذا السطر لأن Render يحقن المتغيرات تلقائيًا
}

// 🧹 دالة صغيرة لإزالة أي مسافات زائدة من قيم .env
const trimEnv = (v) => (typeof v === 'string' ? v.trim() : undefined);

// 🔐 قراءة المتغيرات وتنظيفها
const cloudinaryCloudName = trimEnv(process.env.CLOUDINARY_CLOUD_NAME);
const cloudinaryApiKey = trimEnv(process.env.CLOUDINARY_API_KEY);
const cloudinaryApiSecret = trimEnv(process.env.CLOUDINARY_API_SECRET);
const cloudinaryFolder = trimEnv(process.env.CLOUDINARY_FOLDER) || 'portfolio_uploads';

// 🧠 فحص التهيئة
const isCloudinaryConfigured =
  !!cloudinaryCloudName && !!cloudinaryApiKey && !!cloudinaryApiSecret;

let storage;

if (isCloudinaryConfigured) {
  // ✅ تهيئة Cloudinary مرة واحدة فقط
  cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
  });

  // ✅ إعداد تخزين بسيط وآمن — بدون أي توقيع يدوي
  storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: cloudinaryFolder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    }),
  });

  console.log('✅ Cloudinary storage active');
  console.log('Cloudinary configured:', {
    cloud_name: cloudinaryCloudName,
    api_key_loaded: !!cloudinaryApiKey,
    folder: cloudinaryFolder,
  });
} else {
  // ⚙️ رفع محلي أثناء التطوير فقط (لن يعمل في Render بعد كل deploy)
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

// 📦 التصدير
module.exports = {
  storage,
  cloudinary: isCloudinaryConfigured ? cloudinary : null,
  isCloudinaryConfigured,
  cloudinaryFolder,
};
