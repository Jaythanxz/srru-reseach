const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getTrendingKeywords,
  getUsers,
  updateUserRole,
  getFaculties
} = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Public or Semi-public metadata
router.get('/faculties', getFaculties);

// Admin-only endpoints
router.get('/dashboard', authenticateToken, authorizeRoles('ADMIN', 'TEACHER'), getDashboardStats);
router.get('/trending-keywords', authenticateToken, authorizeRoles('ADMIN', 'TEACHER'), getTrendingKeywords);
router.get('/users', authenticateToken, authorizeRoles('ADMIN'), getUsers);
router.patch('/users/:id/role', authenticateToken, authorizeRoles('ADMIN'), updateUserRole);

module.exports = router;
