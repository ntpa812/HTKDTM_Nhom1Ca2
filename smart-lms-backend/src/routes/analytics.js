const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database'); // ← FIX
const { authenticateToken } = require('../middleware/auth');

// GET /api/analytics/overview/:userId
router.get('/overview/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;

        const pool = await poolPromise;

        // Get user stats
        const stats = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
        SELECT 
          COUNT(DISTINCT e.course_id) as enrolled_courses,
          AVG(e.progress) as avg_progress,
          COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.course_id END) as completed_courses,
          SUM(p.time_spent) as total_time_spent
        FROM Enrollments e
        LEFT JOIN Progress p ON p.user_id = e.user_id AND p.course_id = e.course_id
        WHERE e.user_id = @userId
      `);

        res.json({
            success: true,
            data: stats.recordset[0]
        });

    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

module.exports = router;
