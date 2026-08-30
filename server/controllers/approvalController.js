const { query } = require('../config/db');

// GET /api/approvals/pending - List pending project submissions (Teacher / Admin)
async function getPendingSubmissions(req, res) {
  try {
    const user = req.user;
    let sql = `
      SELECT p.*, f.faculty_name, d.department_name, u.full_name as submitter_name, u.email as submitter_email
      FROM research_projects p
      LEFT JOIN faculties f ON p.faculty_id = f.faculty_id
      LEFT JOIN departments d ON p.department_id = d.department_id
      LEFT JOIN users u ON p.submitted_by = u.user_id
      WHERE p.status = 'PENDING'
    `;
    const params = [];

    // If teacher has specific faculty and not admin, filter by teacher's faculty
    if (user && user.role === 'TEACHER' && user.faculty_id) {
      sql += ' AND p.faculty_id = ?';
      params.push(user.faculty_id);
    }

    sql += ' ORDER BY p.created_at DESC';

    const pendingProjects = await query(sql, params);

    return res.json({
      success: true,
      count: pendingProjects.length,
      data: pendingProjects
    });
  } catch (error) {
    console.error('Get pending submissions error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรายการงานวิจัยที่รอตรวจสอบ',
      error: error.message
    });
  }
}

// PATCH /api/approvals/:id/status - Approve or Reject Project
async function updateApprovalStatus(req, res) {
  try {
    const projectId = parseInt(req.params.id);
    const { status, rejection_reason } = req.body;
    const approvedBy = req.user.user_id;

    if (!status || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุสถานะที่ถูกต้อง (APPROVED, REJECTED, PENDING)'
      });
    }

    if (status === 'REJECTED' && !rejection_reason) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุเหตุผลหรือข้อเสนอแนะในการปฏิเสธ/ส่งกลับแก้ไข'
      });
    }

    const projects = await query('SELECT * FROM research_projects WHERE project_id = ?', [projectId]);
    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลงานวิจัยที่ต้องการดำเนินการ'
      });
    }

    await query(
      'UPDATE research_projects SET status = ?, approved_by = ?, rejection_reason = ?, updated_at = NOW() WHERE project_id = ?',
      [status, approvedBy, status === 'REJECTED' ? rejection_reason : null, projectId]
    );

    const statusText = status === 'APPROVED' ? 'อนุมัติผลงานเรียบร้อยแล้ว' : 'ส่งกลับแก้ไข/ปฏิเสธผลงานเรียบร้อยแล้ว';

    return res.json({
      success: true,
      message: `${statusText}`,
      data: {
        project_id: projectId,
        status,
        rejection_reason: status === 'REJECTED' ? rejection_reason : null,
        approved_by: approvedBy
      }
    });
  } catch (error) {
    console.error('Update approval status error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการปรับปรุงสถานะการอนุมัติ',
      error: error.message
    });
  }
}

module.exports = {
  getPendingSubmissions,
  updateApprovalStatus
};
