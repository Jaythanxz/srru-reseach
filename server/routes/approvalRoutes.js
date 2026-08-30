const express = require('express');
const router = express.Router();
const { getPendingSubmissions, updateApprovalStatus } = require('../controllers/approvalController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

// Teacher / Admin approvals
router.get('/pending', authenticateToken, authorizeRoles('TEACHER', 'ADMIN'), getPendingSubmissions);
router.patch('/:id/status', authenticateToken, authorizeRoles('TEACHER', 'ADMIN'), updateApprovalStatus);

module.exports = router;
