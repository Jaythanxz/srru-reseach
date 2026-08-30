const express = require('express');
const router = express.Router();
const { getBookmarks, addBookmark, removeBookmark, addActivityLog } = require('../controllers/userController');
const { authenticateToken, optionalAuth } = require('../middlewares/auth');

router.get('/bookmarks', authenticateToken, getBookmarks);
router.post('/bookmarks/:projectId', authenticateToken, addBookmark);
router.delete('/bookmarks/:projectId', authenticateToken, removeBookmark);
router.post('/logs', optionalAuth, addActivityLog);

module.exports = router;
