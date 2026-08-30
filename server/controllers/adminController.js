const { query } = require('../config/db');

// GET /api/admin/dashboard - KPI Metrics & Charts data
async function getDashboardStats(req, res) {
  try {
    const projects = await query('SELECT * FROM research_projects');
    const users = await query('SELECT user_id, role FROM users');
    const faculties = await query('SELECT * FROM faculties');
    const logs = await query('SELECT * FROM user_logs');

    const totalPapers = projects.length;
    const approvedPapers = projects.filter(p => p.status === 'APPROVED').length;
    const pendingApprovals = projects.filter(p => p.status === 'PENDING').length;
    const rejectedPapers = projects.filter(p => p.status === 'REJECTED').length;

    const totalViews = projects.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const totalDownloads = projects.reduce((sum, p) => sum + (p.download_count || 0), 0);
    const totalUsers = users.length;

    // Faculty distribution
    const facultyStats = faculties.map(f => {
      const count = projects.filter(p => p.faculty_id === f.faculty_id).length;
      const views = projects.filter(p => p.faculty_id === f.faculty_id).reduce((sum, p) => sum + (p.view_count || 0), 0);
      return {
        faculty_id: f.faculty_id,
        faculty_name: f.faculty_name,
        paper_count: count,
        total_views: views
      };
    });

    // Recent activity
    const recentSubmissions = projects.slice(-5).reverse();

    return res.json({
      success: true,
      stats: {
        totalPapers,
        approvedPapers,
        pendingApprovals,
        rejectedPapers,
        totalViews,
        totalDownloads,
        totalUsers,
        studentsCount: users.filter(u => u.role === 'STUDENT').length,
        teachersCount: users.filter(u => u.role === 'TEACHER').length,
        adminsCount: users.filter(u => u.role === 'ADMIN').length
      },
      facultyStats,
      recentSubmissions
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติแดชบอร์ด',
      error: error.message
    });
  }
}

// GET /api/admin/trending-keywords - Search log keyword frequencies for word cloud
async function getTrendingKeywords(req, res) {
  try {
    const searchLogs = await query("SELECT search_keyword FROM user_logs WHERE action_type = 'SEARCH' AND search_keyword IS NOT NULL");

    const keywordCounts = {};
    searchLogs.forEach(log => {
      if (log && log.search_keyword && typeof log.search_keyword === 'string') {
        const terms = log.search_keyword.split(/[\s,]+/);
        terms.forEach(t => {
          const clean = t.trim();
          if (clean.length > 1) {
            keywordCounts[clean] = (keywordCounts[clean] || 0) + 1;
          }
        });
      }
    });

    // Format list sorted by frequency
    const trending = Object.keys(keywordCounts).map(keyword => ({
      text: keyword,
      value: keywordCounts[keyword]
    })).sort((a, b) => b.value - a.value);

    // If empty or small, supplement with core research keywords
    if (trending.length < 5) {
      const defaults = [
        { text: 'ระบบแนะนำ', value: 18 },
        { text: 'การประมวลผลภาษาไทย', value: 15 },
        { text: 'การเรียนรู้เชิงลึก', value: 12 },
        { text: 'ข้าวหอมมะลิสุรินทร์', value: 10 },
        { text: 'ผ้าไหมสุรินทร์', value: 9 },
        { text: 'อีคอมเมิร์ซ', value: 8 },
        { text: 'IoT', value: 7 },
        { text: 'GIS', value: 6 }
      ];
      return res.json({ success: true, data: defaults });
    }

    return res.json({
      success: true,
      data: trending
    });
  } catch (error) {
    console.error('Get trending keywords error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำค้นหายอดนิยม',
      error: error.message
    });
  }
}

// GET /api/admin/users - User Management List
async function getUsers(req, res) {
  try {
    const sql = `
      SELECT u.user_id, u.username, u.full_name, u.email, u.role, u.faculty_id, u.department_id, u.created_at,
             f.faculty_name, d.department_name
      FROM users u
      LEFT JOIN faculties f ON u.faculty_id = f.faculty_id
      LEFT JOIN departments d ON u.department_id = d.department_id
      ORDER BY u.user_id ASC
    `;
    const users = await query(sql);

    return res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรายชื่อผู้ใช้',
      error: error.message
    });
  }
}

// PATCH /api/admin/users/:id/role - Update User Role
async function updateUserRole(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (!['STUDENT', 'TEACHER', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุ Role ที่ถูกต้อง (STUDENT, TEACHER, ADMIN)'
      });
    }

    await query('UPDATE users SET role = ? WHERE user_id = ?', [role, userId]);

    return res.json({
      success: true,
      message: `เปลี่ยนบทบาทผู้ใช้รหัส ${userId} เป็น ${role} เรียบร้อยแล้ว`
    });
  } catch (error) {
    console.error('Update role error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตบทบาทผู้ใช้',
      error: error.message
    });
  }
}

// GET /api/admin/faculties - Master Faculties list
async function getFaculties(req, res) {
  try {
    const faculties = await query('SELECT * FROM faculties ORDER BY faculty_id ASC');
    const departments = await query('SELECT * FROM departments ORDER BY department_id ASC');

    const result = faculties.map(f => ({
      ...f,
      departments: departments.filter(d => d.faculty_id === f.faculty_id)
    }));

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get faculties error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคณะ',
      error: error.message
    });
  }
}

module.exports = {
  getDashboardStats,
  getTrendingKeywords,
  getUsers,
  updateUserRole,
  getFaculties
};
