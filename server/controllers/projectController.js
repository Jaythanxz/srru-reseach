const path = require('path');
const fs = require('fs');
const { query } = require('../config/db');
const {
  searchSemanticProjects,
  generateAIExecutiveSummary,
  checkTopicRedundancy,
  generateThesisTopicProposals,
  chatDocumentRAG,
  generateResearchKnowledgeGraph
} = require('../services/aiService');
const { uploadFileToStorage, isCloudUrl } = require('../services/storageService');

// POST /api/projects/generate-topics
async function generateTopics(req, res) {
  try {
    const { faculty_id, department_id, keywords, degree_level } = req.body;
    const proposals = await generateThesisTopicProposals({ faculty_id, department_id, keywords, degree_level });
    return res.json({ success: true, count: proposals.length, proposals });
  } catch (error) {
    console.error('Generate topics controller error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการสร้างหัวข้อวิจัย', error: error.message });
  }
}

// POST /api/projects/check-redundancy
async function checkRedundancy(req, res) {
  try {
    const { title_th, title_en, abstract_text, keywords } = req.body;
    const result = await checkTopicRedundancy(title_th, title_en, abstract_text, keywords);
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('Check redundancy controller error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการตรวจสอบความซ้ำซ้อน', error: error.message });
  }
}

// GET /api/projects - Public Search & Filtering
async function getProjects(req, res) {
  try {
    const {
      keyword,
      faculty_id,
      department_id,
      year,
      project_type,
      status = 'APPROVED',
      sort = 'newest',
      mode = 'standard',
      limit = 20,
      page = 1
    } = req.query;

    if (mode === 'semantic' && keyword && keyword.trim()) {
      let semanticResults = await searchSemanticProjects(keyword.trim(), parseInt(limit));
      if (project_type) {
        semanticResults = semanticResults.filter(p => p.project_type === project_type);
      }
      return res.json({
        success: true,
        mode: 'SEMANTIC_VECTOR_SEARCH',
        total: semanticResults.length,
        data: semanticResults
      });
    }

    let sql = `
      SELECT p.*, f.faculty_name, d.department_name, u.full_name as submitter_name
      FROM research_projects p
      LEFT JOIN faculties f ON p.faculty_id = f.faculty_id
      LEFT JOIN departments d ON p.department_id = d.department_id
      LEFT JOIN users u ON p.submitted_by = u.user_id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'ALL') {
      sql += ' AND p.status = ?';
      params.push(status);
    }

    if (project_type) {
      sql += ' AND p.project_type = ?';
      params.push(project_type);
    }

    if (faculty_id) {
      sql += ' AND p.faculty_id = ?';
      params.push(parseInt(faculty_id));
    }

    if (department_id) {
      sql += ' AND p.department_id = ?';
      params.push(parseInt(department_id));
    }

    if (year) {
      sql += ' AND p.publish_year = ?';
      params.push(parseInt(year));
    }

    if (keyword && keyword.trim()) {
      const cleanKeyword = keyword.trim();
      sql += ` AND (p.title_th LIKE ? OR p.title_en LIKE ? OR p.abstract_text LIKE ? OR p.keywords LIKE ? OR p.authors LIKE ? OR p.advisor_name LIKE ?)`;
      const term = `%${cleanKeyword}%`;
      params.push(term, term, term, term, term, term);

      const userId = req.user ? req.user.user_id : (req.query.userId || 4);
      try {
        await query(
          'INSERT INTO user_logs (user_id, action_type, search_keyword, project_id) VALUES (?, ?, ?, NULL)',
          [userId, 'SEARCH', cleanKeyword]
        );
      } catch (logErr) {
        console.warn('Logging search error (non-fatal):', logErr.message);
      }
    }

    if (sort === 'popular') {
      sql += ' ORDER BY p.view_count DESC, p.download_count DESC';
    } else if (sort === 'downloads') {
      sql += ' ORDER BY p.download_count DESC';
    } else if (sort === 'year') {
      sql += ' ORDER BY p.publish_year DESC, p.project_id DESC';
    } else {
      sql += ' ORDER BY p.created_at DESC, p.project_id DESC';
    }

    const projects = await query(sql, params);

    return res.json({
      success: true,
      mode: 'KEYWORD_SEARCH',
      total: projects.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการค้นหาผลงานวิจัย',
      error: error.message
    });
  }
}

// GET /api/projects/:id - Project Details & Log View Event
async function getProjectById(req, res) {
  try {
    const projectId = parseInt(req.params.id);

    const sql = `
      SELECT p.*, f.faculty_name, d.department_name, u.full_name as submitter_name, approver.full_name as approver_name
      FROM research_projects p
      LEFT JOIN faculties f ON p.faculty_id = f.faculty_id
      LEFT JOIN departments d ON p.department_id = d.department_id
      LEFT JOIN users u ON p.submitted_by = u.user_id
      LEFT JOIN users approver ON p.approved_by = approver.user_id
      WHERE p.project_id = ?
    `;

    const projects = await query(sql, [projectId]);

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลงานวิจัยที่ต้องการ'
      });
    }

    const project = projects[0];

    // Increment view count
    await query('UPDATE research_projects SET view_count = view_count + 1 WHERE project_id = ?', [projectId]);
    project.view_count += 1;

    // Log VIEW event
    const userId = req.user ? req.user.user_id : (req.query.userId || 4);
    try {
      await query(
        'INSERT INTO user_logs (user_id, action_type, search_keyword, project_id) VALUES (?, ?, NULL, ?)',
        [userId, 'VIEW', projectId]
      );
    } catch (logErr) {
      console.warn('Logging view error (non-fatal):', logErr.message);
    }

    return res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลงานวิจัย',
      error: error.message
    });
  }
}

// GET /api/projects/:id/ai-summary
async function getAISummary(req, res) {
  try {
    const projectId = parseInt(req.params.id);
    const projects = await query('SELECT * FROM research_projects WHERE project_id = ?', [projectId]);

    if (!projects || projects.length === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลงานวิจัย' });
    }

    const summary = await generateAIExecutiveSummary(projects[0]);
    return res.json(summary);
  } catch (error) {
    console.error('Get AI summary error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างบทสรุป AI',
      error: error.message
    });
  }
}

// POST /api/projects - Submit new project paper + PDF upload
async function createProject(req, res) {
  try {
    const {
      title_th,
      title_en,
      abstract_text,
      keywords,
      authors,
      advisor_name,
      faculty_id,
      department_id,
      publish_year,
      project_type = 'THESIS'
    } = req.body;

    if (!title_th || !abstract_text || !keywords || !authors || !advisor_name || !faculty_id || !department_id || !publish_year) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'
      });
    }

    let pdfFilePath = '/uploads/sample_paper_1.pdf';
    let coverImagePath = req.body.cover_image_path || null;
    let authorImagePath = req.body.author_image_path || null;

    if (req.files) {
      if (req.files['pdf_file'] && req.files['pdf_file'][0]) {
        pdfFilePath = await uploadFileToStorage(req.files['pdf_file'][0], 'theses');
      }
      if (req.files['cover_image'] && req.files['cover_image'][0]) {
        coverImagePath = await uploadFileToStorage(req.files['cover_image'][0], 'covers');
      }
      if (req.files['author_image'] && req.files['author_image'][0]) {
        authorImagePath = await uploadFileToStorage(req.files['author_image'][0], 'authors');
      }
    } else if (req.file) {
      pdfFilePath = await uploadFileToStorage(req.file, 'theses');
    }

    const submittedBy = req.user ? req.user.user_id : 4;

    const result = await query(
      `INSERT INTO research_projects (
        title_th, title_en, abstract_text, keywords, authors, advisor_name,
        faculty_id, department_id, publish_year, project_type, pdf_file_path, cover_image_path, author_image_path, status, submitted_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'APPROVED', ?)`,
      [
        title_th,
        title_en || '',
        abstract_text,
        keywords,
        authors,
        advisor_name,
        parseInt(faculty_id),
        parseInt(department_id),
        parseInt(publish_year),
        project_type,
        pdfFilePath,
        coverImagePath,
        authorImagePath,
        submittedBy
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'ส่งผลงานวิจัยเข้าสู่ระบบสำเร็จ พร้อมเผยแพร่และสืบค้นได้ทันที (APPROVED)',
      projectId: result.insertId,
      cover_image_path: coverImagePath,
      author_image_path: authorImagePath
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งผลงานวิจัย',
      error: error.message
    });
  }
}

// PUT /api/projects/:id - Edit project metadata
async function updateProject(req, res) {
  try {
    const projectId = parseInt(req.params.id);
    const {
      title_th,
      title_en,
      abstract_text,
      keywords,
      authors,
      advisor_name,
      faculty_id,
      department_id,
      publish_year,
      annotations
    } = req.body;

    const existing = await query('SELECT * FROM research_projects WHERE project_id = ?', [projectId]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบงานวิจัยที่ต้องการแก้ไข'
      });
    }

    let pdfFilePath = existing[0].pdf_file_path;
    if (req.file) {
      pdfFilePath = await uploadFileToStorage(req.file, 'theses');
    }

    await query(
      `UPDATE research_projects SET
        title_th = ?, title_en = ?, abstract_text = ?, keywords = ?, authors = ?, advisor_name = ?,
        faculty_id = ?, department_id = ?, publish_year = ?, pdf_file_path = ?, rejection_reason = ?, updated_at = NOW()
       WHERE project_id = ?`,
      [
        title_th || existing[0].title_th,
        title_en !== undefined ? title_en : existing[0].title_en,
        abstract_text || existing[0].abstract_text,
        keywords || existing[0].keywords,
        authors || existing[0].authors,
        advisor_name || existing[0].advisor_name,
        faculty_id ? parseInt(faculty_id) : existing[0].faculty_id,
        department_id ? parseInt(department_id) : existing[0].department_id,
        publish_year ? parseInt(publish_year) : existing[0].publish_year,
        pdfFilePath,
        annotations || existing[0].rejection_reason,
        projectId
      ]
    );

    return res.json({
      success: true,
      message: 'อัปเดตข้อมูลงานวิจัยเรียบร้อยแล้ว'
    });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลงานวิจัย',
      error: error.message
    });
  }
}

// DELETE /api/projects/:id - Admin Only
async function deleteProject(req, res) {
  try {
    const projectId = parseInt(req.params.id);
    await query('DELETE FROM research_projects WHERE project_id = ?', [projectId]);
    return res.json({ success: true, message: 'ลบผลงานวิจัยออกจากระบบเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการลบงานวิจัย', error: error.message });
  }
}

// GET /api/projects/:id/pdf - Stream PDF
async function getPdf(req, res) {
  try {
    const projectId = parseInt(req.params.id);
    const projects = await query('SELECT * FROM research_projects WHERE project_id = ?', [projectId]);

    if (!projects || projects.length === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบไฟล์เอกสาร' });
    }

    const project = projects[0];

    // If PDF is stored in Cloud Storage (e.g. Supabase Public URL), redirect directly
    if (project.pdf_file_path && isCloudUrl(project.pdf_file_path)) {
      return res.redirect(project.pdf_file_path);
    }

    const filename = path.basename(project.pdf_file_path || 'sample_paper_1.pdf');
    const filePath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filename)}"`);
      return fs.createReadStream(filePath).pipe(res);
    } else {
      const samplePdfPath = path.join(__dirname, '../uploads/sample_paper_1.pdf');
      if (fs.existsSync(samplePdfPath)) {
        res.setHeader('Content-Type', 'application/pdf');
        return fs.createReadStream(samplePdfPath).pipe(res);
      }
      return res.status(404).json({ success: false, message: 'ไฟล์เอกสาร PDF ไม่พร้อมใช้งาน' });
    }
  } catch (error) {
    console.error('Get PDF error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการเปิดไฟล์ PDF' });
  }
}

// POST /api/projects/:id/download
async function downloadProject(req, res) {
  try {
    const projectId = parseInt(req.params.id);
    const userId = req.user ? req.user.user_id : (req.body.userId || 4);

    await query('UPDATE research_projects SET download_count = download_count + 1 WHERE project_id = ?', [projectId]);

    try {
      await query(
        'INSERT INTO user_logs (user_id, action_type, search_keyword, project_id) VALUES (?, ?, NULL, ?)',
        [userId, 'DOWNLOAD', projectId]
      );
    } catch (logErr) {
      console.warn('Logging download error (non-fatal):', logErr.message);
    }

    return res.json({ success: true, message: 'บันทึกการดาวน์โหลดสำเร็จ' });
  } catch (error) {
    console.error('Download project error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดาวน์โหลดเอกสาร', error: error.message });
  }
}

// POST /api/projects/:id/chat-document (RAG Interactive Q&A on PDF)
async function chatWithDocument(req, res) {
  try {
    const projectId = parseInt(req.params.id);
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุคำถามที่ต้องการสนทนากับเอกสาร' });
    }

    const result = await chatDocumentRAG(projectId, question.trim());
    return res.json({
      success: true,
      projectId,
      ...result
    });
  } catch (error) {
    console.error('Chat with document error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการสนทนากับเอกสาร RAG', error: error.message });
  }
}

// GET /api/projects/knowledge-graph (Interactive 2D/3D Research Graph)
async function getKnowledgeGraph(req, res) {
  try {
    const graphData = await generateResearchKnowledgeGraph();
    return res.json({
      success: true,
      ...graphData
    });
  } catch (error) {
    console.error('Get knowledge graph error:', error);
    return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล Knowledge Graph', error: error.message });
  }
}

module.exports = {
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
};
