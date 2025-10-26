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

// GET upcoming deadlines
router.get('/deadlines', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('userId', userId)
            .input('now', new Date())
            .query(`
            SELECT TOP 10
            q.id,
            'Quiz: ' + q.title as title,
            'quiz' as type,
            c.title as course,
            q.due_date as dueDate,
            CASE WHEN qa.completed_at IS NOT NULL THEN 1 ELSE 0 END as isCompleted
            FROM Quizzes q
            JOIN Courses c ON q.course_id = c.id
            JOIN Enrollments e ON c.id = e.course_id
            LEFT JOIN QuizAttempts qa ON q.id = qa.quiz_id AND qa.student_id = e.student_id
            WHERE e.student_id = @userId 
            AND q.due_date > @now
            AND (qa.completed_at IS NULL OR qa.completed_at < q.due_date)
            
            UNION ALL
            
            SELECT TOP 10
            a.id,
            'Assignment: ' + a.title as title,
            'assignment' as type,
            c.title as course,
            a.due_date as dueDate,
            CASE WHEN asub.submitted_at IS NOT NULL THEN 1 ELSE 0 END as isCompleted
            FROM Assignments a
            JOIN Courses c ON a.course_id = c.id
            JOIN Enrollments e ON c.id = e.course_id
            LEFT JOIN AssignmentSubmissions asub ON a.id = asub.assignment_id AND asub.student_id = e.student_id
            WHERE e.student_id = @userId 
            AND a.due_date > @now
            AND (asub.submitted_at IS NULL OR asub.submitted_at < a.due_date)
            
            ORDER BY dueDate ASC
        `);

        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error fetching deadlines:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy deadlines',
            error: error.message
        });
    }
});

// GET performance metrics
router.get('/metrics', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise;

        // Get average score
        const scoreResult = await pool.request()
            .input('userId', userId)
            .query(`
                SELECT 
                AVG(CAST(qa.score as FLOAT)) as averageScore,
                (SELECT AVG(CAST(score as FLOAT)) FROM QuizAttempts) as classAverage
                FROM QuizAttempts qa
                WHERE qa.student_id = @userId AND qa.completed_at IS NOT NULL
            `);

        // Get completion rate
        const completionResult = await pool.request()
            .input('userId', userId)
            .query(`
                SELECT 
                COUNT(CASE WHEN progress >= 100 THEN 1 END) * 100.0 / COUNT(*) as completionRate
                FROM Enrollments
                WHERE student_id = @userId
            `);

        // Get study time today
        const studyTimeResult = await pool.request()
            .input('userId', userId)
            .input('today', new Date().toDateString())
            .query(`
                SELECT SUM(DATEDIFF(MINUTE, started_at, completed_at)) / 60.0 as studyTimeToday
                FROM LessonProgress
                WHERE student_id = @userId 
                AND CAST(started_at as DATE) = @today
            `);

        res.json({
            success: true,
            data: {
                averageScore: scoreResult.recordset[0].averageScore || 0,
                classAverage: scoreResult.recordset[0].classAverage || 0,
                completionRate: completionResult.recordset[0].completionRate || 0,
                targetCompletionRate: 80,
                studyTimeToday: studyTimeResult.recordset[0].studyTimeToday || 0,
                studyTimeGoal: 4,
                engagementScore: 85, // Calculate from multiple factors
                badges: 12,
                totalBadges: 20,
                streak: 7,
                bestStreak: 14,
                performanceTrend: 'up'
            }
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy metrics',
            error: error.message
        });
    }
});


module.exports = router;
