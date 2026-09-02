const express = require('express');
const router = express.Router();
const { getBookmarks, addBookmark, removeBookmark, addActivityLog, getMyProjects, getNotifications } = require('../controllers/userController');
const { authenticateToken, optionalAuth } = require('../middlewares/auth');

router.get('/bookmarks', authenticateToken, getBookmarks);
router.post('/bookmarks/:projectId', authenticateToken, addBookmark);
router.delete('/bookmarks/:projectId', authenticateToken, removeBookmark);
router.post('/logs', optionalAuth, addActivityLog);
router.get('/my-projects', authenticateToken, getMyProjects);
router.get('/notifications', authenticateToken, getNotifications);

module.exports = router;
