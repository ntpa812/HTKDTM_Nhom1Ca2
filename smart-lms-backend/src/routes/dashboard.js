// File: smart-lms-backend/src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../config/database');
const { authenticateToken: auth } = require('../middleware/auth');
const { getAIPrediction } = require('../services/aiService');

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Query với tên cột đúng schema database
        const enrolledCoursesPromise = sql.query`
            SELECT 
                c.id AS ID, 
                c.title AS Title, 
                c.category AS Category, 
                e.progress AS Progress
            FROM dbo.Enrollments e
            JOIN dbo.Courses c ON e.course_id = c.id
            WHERE e.user_id = ${userId}
        `;

        const statsPromise = sql.query`
            SELECT 
                COUNT(*) as TotalCourses,
                AVG(progress) as AverageProgress,
                COUNT(CASE WHEN progress >= 100 THEN 1 END) as CompletedCourses
            FROM dbo.Enrollments
            WHERE user_id = ${userId}
        `;

        // Tạm comment AI để tránh lỗi model
        // const aiPredictionPromise = getAIPrediction(userId);

        const [enrolledCoursesResult, statsResult] = await Promise.all([
            enrolledCoursesPromise,
            statsPromise
        ]);

        const dashboardData = {
            stats: {
                totalEnrolledCourses: statsResult.recordset[0]?.TotalCourses || 0,
                averageProgress: parseFloat(statsResult.recordset[0]?.AverageProgress || 0),
                completedCourses: statsResult.recordset[0]?.CompletedCourses || 0,
                averageScore: 0 // Tạm để 0
            },
            enrolledCourses: enrolledCoursesResult.recordset || [],
            aiPrediction: null, // Tạm tắt AI
            progressData: []
        };

        res.json(dashboardData);

    } catch (err) {
        console.error("Lỗi dashboard:", err.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
});

module.exports = router;
