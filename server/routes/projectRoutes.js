const express = require('express');
const router = express.Router();
const {
  checkRedundancy,
  generateTopics,
  getProjects,
  getProjectById,
  getAISummary,
  createProject,
  updateProject,
  deleteProject,
  getPdf,
  downloadProject,
  chatWithDocument,
  getKnowledgeGraph
} = require('../controllers/projectController');
const { authenticateToken, authorizeRoles, optionalAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Real-time AI Redundancy Check, Topic Generator & Knowledge Graph
router.post('/check-redundancy', optionalAuth, checkRedundancy);
router.post('/generate-topics', optionalAuth, generateTopics);
router.get('/knowledge-graph', optionalAuth, getKnowledgeGraph);

// Public search & view
router.get('/', optionalAuth, getProjects);
router.get('/:id', optionalAuth, getProjectById);
router.get('/:id/ai-summary', optionalAuth, getAISummary);
router.get('/:id/pdf', getPdf);
router.post('/:id/download', optionalAuth, downloadProject);
router.post('/:id/chat-document', optionalAuth, chatWithDocument);

const uploadFields = upload.fields([
  { name: 'pdf_file', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 },
  { name: 'author_image', maxCount: 1 }
]);

// Student / Author submission (PDF + Cover / Author Image)
router.post('/', authenticateToken, uploadFields, createProject);
router.put('/:id', authenticateToken, uploadFields, updateProject);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN', 'TEACHER'), deleteProject);

module.exports = router;
