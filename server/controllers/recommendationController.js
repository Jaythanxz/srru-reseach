const { getPersonalizedRecommendations, getSimilarProjects } = require('../services/aiService');

// GET /api/recommendations/personalized - Get personalized research recommendations
async function getPersonalized(req, res) {
  try {
    const userId = req.user ? req.user.user_id : (req.query.userId ? parseInt(req.query.userId) : 4);
    const limit = parseInt(req.query.limit || 6);

    const recommendations = await getPersonalizedRecommendations(userId, limit);

    return res.json({
      success: true,
      count: recommendations.length,
      algorithm: 'HYBRID (Thai NLP TF-IDF + Collaborative Filtering Logs)',
      weights: { content_based: 0.6, collaborative: 0.4 },
      data: recommendations
    });
  } catch (error) {
    console.error('Get personalized recommendations error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการประมวลผลการแนะนำงานวิจัย',
      error: error.message
    });
  }
}

// GET /api/recommendations/similar/:projectId - Get item-item similar research
async function getSimilar(req, res) {
  try {
    const projectId = parseInt(req.params.projectId);
    const limit = parseInt(req.query.limit || 4);

    const similarProjects = await getSimilarProjects(projectId, limit);

    return res.json({
      success: true,
      count: similarProjects.length,
      target_project_id: projectId,
      data: similarProjects
    });
  } catch (error) {
    console.error('Get similar projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการค้นหางานวิจัยที่คล้ายกัน',
      error: error.message
    });
  }
}

module.exports = {
  getPersonalized,
  getSimilar
};
