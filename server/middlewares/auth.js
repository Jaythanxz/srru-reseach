const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'srru_super_secret_jwt_key_2024_graduation_thesis';

// Middleware to authenticate JWT Token from Bearer header or Cookie
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ (Access Token Missing)'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'โทเค็นไม่ถูกต้องหรือหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้ง'
      });
    }
    req.user = user;
    next();
  });
}

// Middleware to authorize specific user roles (STUDENT, TEACHER, ADMIN)
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `คุณไม่มีสิทธิ์เข้าถึงฟังก์ชันนี้ (Required: ${allowedRoles.join(', ')})`
      });
    }
    next();
  };
}

// Optional Auth (For tracking logged-in user if available, otherwise guest)
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err && user) {
        req.user = user;
      }
      next();
    });
  } else {
    next();
  }
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  authorizeRoles,
  optionalAuth
};
