const jwt = require('jsonwebtoken');

// Simple in-memory storage for demo (in production, use a database)
const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 'password'
    role: 'admin'
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  console.log('🔐 [AUTH DEBUG] Authenticating request to:', req.path);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('🔐 [AUTH DEBUG] Auth header:', authHeader);
  console.log('🔐 [AUTH DEBUG] Token:', token ? 'Present' : 'Missing');

  if (!token) {
    console.log('❌ [AUTH DEBUG] No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ [AUTH DEBUG] Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    console.log('✅ [AUTH DEBUG] Token verified for user:', user);
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = {
  users,
  JWT_SECRET,
  authenticateToken,
  requireAdmin
};
