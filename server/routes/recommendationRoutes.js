const express = require('express');
const router = express.Router();
const { getPersonalized, getSimilar } = require('../controllers/recommendationController');
const { optionalAuth } = require('../middlewares/auth');

router.get('/personalized', optionalAuth, getPersonalized);
router.get('/similar/:projectId', optionalAuth, getSimilar);

module.exports = router;
