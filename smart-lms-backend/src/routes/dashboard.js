const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../config/database');
const auth = require('../middleware/auth');

// GET recent activities
router.get('/activities', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise;

        // Query activities từ nhiều bảng
        const result = await pool.request()
            .input('userId', userId)
            .query(`
            SELECT TOP 10
            'enrollment' as type,
            'Đã đăng ký khóa học "' + c.title + '"' as message,
            e.enrolled_at as timestamp,
            'book' as icon
            FROM Enrollments e
            JOIN Courses c ON e.course_id = c.id
            WHERE e.student_id = @userId
            
            UNION ALL
            
            SELECT TOP 10
            'quiz' as type,
            'Hoàn thành Quiz: ' + q.title + ' - Điểm ' + CAST(qa.score as varchar) + '/100' as message,
            qa.completed_at as timestamp,
            'check' as icon
            FROM QuizAttempts qa
            JOIN Quizzes q ON qa.quiz_id = q.id
            WHERE qa.student_id = @userId AND qa.completed_at IS NOT NULL
            
            ORDER BY timestamp DESC
        `);

        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy hoạt động',
            error: error.message
        });
    }
});

module.exports = router;
