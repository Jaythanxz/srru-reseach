const express = require('express');
const router = express.Router();
const { handleGeneralChat, handleDocumentRAGChat } = require('../services/geminiService');

/**
 * POST /api/chat
 * General AI Assistant Chatbot (Floating widget)
 * Body: { message: string, history: Array }
 */
router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await handleGeneralChat({ message, history });
    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      details: error.message
    });
  }
});

/**
 * POST /api/chat/document
 * Interactive RAG Q&A on a specific research paper
 * Body: { projectId: number, question: string, history: Array }
 */
router.post('/document', async (req, res) => {
  try {
    const { projectId, question, history } = req.body;
    if (!projectId || !question) {
      return res.status(400).json({ error: 'projectId and question are required' });
    }

    const result = await handleDocumentRAGChat({ projectId, question, history });
    res.json(result);
  } catch (error) {
    console.error('Document RAG error:', error);
    res.status(500).json({
      error: 'Failed to process document Q&A',
      details: error.message
    });
  }
});

module.exports = router;
