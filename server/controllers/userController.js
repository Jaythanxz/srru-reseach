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

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark,
  addActivityLog
};
