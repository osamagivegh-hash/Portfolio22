const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Test multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    console.log('Upload path:', uploadPath);
    
    if (!fs.existsSync(uploadPath)) {
      console.log('Creating upload directory...');
      fs.mkdirSync(uploadPath, { recursive: true });
    } else {
      console.log('Upload directory already exists');
    }
    
    // Check if directory is writable
    try {
      fs.accessSync(uploadPath, fs.constants.W_OK);
      console.log('Upload directory is writable');
    } catch (error) {
      console.log('Upload directory is NOT writable:', error.message);
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      console.log('File type accepted:', file.mimetype);
      cb(null, true);
    } else {
      console.log('File type rejected:', file.mimetype);
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

console.log('✅ Multer configuration test completed');
console.log('Upload directory:', path.join(__dirname, '../uploads'));
console.log('Directory exists:', fs.existsSync(path.join(__dirname, '../uploads')));
