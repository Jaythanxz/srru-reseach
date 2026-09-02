const { query } = require('../config/db');

// GET /api/user/bookmarks - List bookmarked projects for current user
async function getBookmarks(req, res) {
  try {
    const userId = req.user.user_id;

    const sql = `
      SELECT b.bookmark_id, b.created_at as bookmarked_at,
             p.*, f.faculty_name, d.department_name
      FROM user_bookmarks b
      INNER JOIN research_projects p ON b.project_id = p.project_id
      LEFT JOIN faculties f ON p.faculty_id = f.faculty_id
      LEFT JOIN departments d ON p.department_id = d.department_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `;

    const bookmarks = await query(sql, [userId]);

    return res.json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรายการบุ๊กมาร์ก',
      error: error.message
    });
  }
}

// POST /api/user/bookmarks/:projectId - Add to bookmarks
async function addBookmark(req, res) {
  try {
    const userId = req.user.user_id;
    const projectId = parseInt(req.params.projectId);

    // Insert bookmark
    await query(
      'INSERT INTO user_bookmarks (user_id, project_id) VALUES (?, ?)',
      [userId, projectId]
    );

    // Log BOOKMARK activity for Collaborative Filtering
    try {
      await query(
        'INSERT INTO user_logs (user_id, action_type, search_keyword, project_id) VALUES (?, ?, NULL, ?)',
        [userId, 'BOOKMARK', projectId]
      );
    } catch (logErr) {
      console.warn('Log bookmark error (non-fatal):', logErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'เพิ่มงานวิจัยลงในรายการบุ๊กมาร์กเรียบร้อยแล้ว'
    });
  } catch (error) {
    // If unique constraint error, consider as already bookmarked
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({
        success: true,
        message: 'งานวิจัยนี้อยู่ในรายการบุ๊กมาร์กของคุณแล้ว'
      });
    }
    console.error('Add bookmark error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกบุ๊กมาร์ก',
      error: error.message
    });
  }
}

// DELETE /api/user/bookmarks/:projectId - Remove from bookmarks
async function removeBookmark(req, res) {
  try {
    const userId = req.user.user_id;
    const projectId = parseInt(req.params.projectId);

    await query(
      'DELETE FROM user_bookmarks WHERE user_id = ? AND project_id = ?',
      [userId, projectId]
    );

    return res.json({
      success: true,
      message: 'ลบงานวิจัยออกจากรายการบุ๊กมาร์กเรียบร้อยแล้ว'
    });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบบุ๊กมาร์ก',
      error: error.message
    });
  }
}

// POST /api/user/logs - Record activity log
async function addActivityLog(req, res) {
  try {
    const userId = req.user ? req.user.user_id : (req.body.userId || 4);
    const { action_type, search_keyword, project_id } = req.body;

    if (!action_type || !['SEARCH', 'VIEW', 'BOOKMARK', 'DOWNLOAD'].includes(action_type)) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุ action_type ให้ถูกต้อง (SEARCH, VIEW, BOOKMARK, DOWNLOAD)'
      });
    }

    await query(
      'INSERT INTO user_logs (user_id, action_type, search_keyword, project_id) VALUES (?, ?, ?, ?)',
      [userId, action_type, search_keyword || null, project_id ? parseInt(project_id) : null]
    );

    return res.status(201).json({
      success: true,
      message: 'บันทึกประวัติกิจกรรมเรียบร้อยแล้ว'
    });
  } catch (error) {
    console.error('Add log error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกประวัติกิจกรรม',
      error: error.message
    });
  }
}

// GET /api/user/my-projects - List projects submitted by current student
async function getMyProjects(req, res) {
  try {
    const userId = req.user.user_id;

    const sql = `
      SELECT p.*, f.faculty_name, d.department_name, approver.full_name as approver_name
      FROM research_projects p
      LEFT JOIN faculties f ON p.faculty_id = f.faculty_id
      LEFT JOIN departments d ON p.department_id = d.department_id
      LEFT JOIN users approver ON p.approved_by = approver.user_id
      WHERE p.submitted_by = ?
      ORDER BY p.updated_at DESC, p.created_at DESC
    `;

    const projects = await query(sql, [userId]);

    return res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get my projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผลงานของคุณ',
      error: error.message
    });
  }
}

// GET /api/user/notifications - Get student notifications for review status
async function getNotifications(req, res) {
  try {
    const userId = req.user.user_id;

    const sql = `
      SELECT p.project_id, p.title_th, p.status, p.rejection_reason, p.updated_at,
             approver.full_name as reviewer_name
      FROM research_projects p
      LEFT JOIN users approver ON p.approved_by = approver.user_id
      WHERE p.submitted_by = ?
      ORDER BY p.updated_at DESC
    `;

    const items = await query(sql, [userId]);

    const notifications = [];
    items.forEach((item, idx) => {
      if (item.status === 'REJECTED') {
        notifications.push({
          id: `notif_rej_${item.project_id}_${idx}`,
          project_id: item.project_id,
          title: item.title_th,
          type: 'REJECTED',
          status: 'REJECTED',
          sender: item.reviewer_name || 'ผศ.ดร. ประเสริฐ สกุลดี (อาจารย์ที่ปรึกษา)',
          message: item.rejection_reason || 'อาจารย์ได้ส่งผลงานกลับเพื่อให้นักศึกษาแก้ไขเพิ่มเติม',
          time: item.updated_at || new Date(),
          unread: true
        });
      } else if (item.status === 'APPROVED') {
        notifications.push({
          id: `notif_app_${item.project_id}_${idx}`,
          project_id: item.project_id,
          title: item.title_th,
          type: 'APPROVED',
          status: 'APPROVED',
          sender: item.reviewer_name || 'อาจารย์ที่ปรึกษา',
          message: 'ยินดีด้วย! ผลงานวิจัยของคุณได้รับการอนุมัติและเผยแพร่ในคลังแล้ว',
          time: item.updated_at || new Date(),
          unread: false
        });
      }
    });

    return res.json({
      success: true,
      unreadCount: notifications.filter(n => n.unread).length,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรายการแจ้งเตือน',
      error: error.message
    });
  }
}

module.exports = {
  getMyProjects,
  getNotifications,
  getBookmarks,
  addBookmark,
  removeBookmark,
  addActivityLog
};
