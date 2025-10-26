const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database'); // ← FIX
const { authenticateToken } = require('../middleware/auth');

// GET /api/ai/recommend/:userId - Get AI recommendations
router.get('/recommend/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT TOP 5
          c.id, c.title, c.description, c.difficulty, c.duration_hours, c.category,
          r.score as recommendation_score, r.reason
        FROM Recommendations r
        JOIN Courses c ON r.course_id = c.id
        WHERE r.user_id = @userId
        ORDER BY r.score DESC, r.created_at DESC
      `);

    res.json({
      success: true,
      data: {
        recommendations: result.recordset
      }
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
});

module.exports = router;
