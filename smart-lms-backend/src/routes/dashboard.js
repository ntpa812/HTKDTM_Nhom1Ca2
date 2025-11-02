// File: smart-lms-backend/src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');

const { authenticateToken: auth } = require('../middleware/auth');

const { getAIPrediction } = require('../services/aiService');

// @route   GET /api/dashboard
// @desc    Lấy dữ liệu dashboard cho sinh viên đăng nhập
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Lấy dữ liệu chính từ CSDL
        const enrolledCoursesPromise = sql.query`
            SELECT c.ID, c.Title, c.Category, e.Progress, c.ThumbnailURL
            FROM Enrollments e
            JOIN Courses c ON e.CourseID = c.ID
            WHERE e.UserID = ${userId}
        `;

        const statsPromise = sql.query`
            SELECT 
                COUNT(*) as TotalCourses,
                AVG(Progress) as AverageProgress
            FROM Enrollments
            WHERE UserID = ${userId}
        `;

        // Lấy dự đoán từ AI
        const aiPredictionPromise = getAIPrediction(userId);

        // Chạy tất cả các tác vụ bất đồng bộ song song
        const [
            enrolledCoursesResult,
            statsResult,
            aiPrediction
        ] = await Promise.all([
            enrolledCoursesPromise,
            statsPromise,
            aiPredictionPromise
        ]);

        // Tổng hợp và trả về kết quả
        const dashboardData = {
            user: {
                id: req.user.id,
                username: req.user.username,
                fullName: req.user.fullName,
            },
            stats: {
                totalEnrolledCourses: statsResult.recordset[0]?.TotalCourses || 0,
                averageProgress: parseFloat(statsResult.recordset[0]?.AverageProgress || 0).toFixed(2),
            },
            enrolledCourses: enrolledCoursesResult.recordset,
            aiPrediction: aiPrediction
        };

        res.json(dashboardData);

    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
