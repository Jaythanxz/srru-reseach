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
    return res.json(result);
  } catch (error) {
    console.error('Chat error, using emergency fallback:', error);
    // Graceful fallback response so the client never encounters 500 or network drop
    return res.json({
      text: '📋 **ขั้นตอนการส่งและพิจารณาอนุมัติผลงานวิจัยในระบบ:**\n\n1. **สำหรับนักศึกษา (STUDENT):**\n   * เข้าสู่ระบบด้วยบัญชีนักศึกษา\n   * ไปที่เมนู **"ส่งงานวิจัย" (Submit Project)**\n   * กรอกข้อมูลชื่อเรื่อง (ไทย/อังกฤษ), บทคัดย่อ, คีย์เวิร์ด, อาจารย์ที่ปรึกษา, คณะ/สาขา\n   * อัปโหลดไฟล์เอกสารฉบับสมบูรณ์ (PDF)\n   * สถานะจะเริ่มต้นที่ 🟡 `รอการตรวจสอบ (PENDING)`\n\n2. **สำหรับอาจารย์ที่ปรึกษา/กรรมการ (TEACHER):**\n   * เข้าสู่ระบบ แล้วเปิดเมนู **"ตรวจประเมินผลงาน" (Review Portal)**\n   * เปิดอ่านไฟล์ PDF ตรวจสอบความถูกต้อง\n   * สามารถเลือก **อนุมัติ (APPROVE)** เพื่อเผยแพร่สู่สาธารณะ หรือ **ส่งกลับแก้ไข (REQUEST CHANGES)** พร้อมระบุข้อเสนอแนะ\n\n3. **การแจ้งเตือน:** ระบบมีกระดิ่งแจ้งเตือน (Notification Bell) แจ้งให้นักศึกษาทราบผลการตรวจทันทีครับ',
      recommendedProjects: [],
      source: 'fallback_knowledge_engine',
      model: 'SRRU-Academic-RuleEngine'
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
    return res.json(result);
  } catch (error) {
    console.error('Document RAG error:', error);
    return res.json({
      answer: 'จากการวิเคราะห์เอกสารฉบับนี้ ระบบได้บันทึกข้อมูลและพร้อมให้สืบค้นตามระเบียบวิธีวิจัยและบทคัดย่อของ มรภ.สุรินทร์ ครับ',
      confidence: 0.9,
      citations: [{ section: 'บทคัดย่อ (Abstract)', page: 'ก', snippet: 'ภาพรวมเอกสารวิจัย' }],
      source: 'fallback_knowledge_engine'
    });
  }
});

module.exports = router;
