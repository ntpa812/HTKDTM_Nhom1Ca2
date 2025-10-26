const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database'); // ← FIX
const { authenticateToken } = require('../middleware/auth');

// GET /api/progress/:userId - Get user progress
router.get('/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
        SELECT 
          c.id as course_id,
          c.title as course_title,
          e.progress,
          e.status,
          e.enrolled_at,
          COUNT(p.id) as completed_lessons,
          AVG(p.score) as avg_score
        FROM Enrollments e
        JOIN Courses c ON e.course_id = c.id
        LEFT JOIN Progress p ON p.user_id = e.user_id AND p.course_id = e.course_id AND p.completed = 1
        WHERE e.user_id = @userId
        GROUP BY c.id, c.title, e.progress, e.status, e.enrolled_at
        ORDER BY e.enrolled_at DESC
      `);

        res.json({
            success: true,
            data: {
                progress: result.recordset
            }
        });

    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

module.exports = router;
