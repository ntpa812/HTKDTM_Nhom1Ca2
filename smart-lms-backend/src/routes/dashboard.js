// smart-lms-backend/src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database');
const { authenticateToken: auth } = require('../middleware/auth');
// const { getAIPrediction } = require('../services/aiService');

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise; // ✅ THÊM pool

        const enrolledCoursesResult = await pool.request()
            .input('user_id', sql.Int, userId)
            .query(`
                SELECT 
                    c.id AS ID, 
                    c.title AS Title, 
                    c.category AS Category, 
                    e.progress AS Progress
                FROM dbo.Enrollments e
                JOIN dbo.Courses c ON e.course_id = c.id
                WHERE e.user_id = @user_id
            `);

        const statsResult = await pool.request()
            .input('user_id', sql.Int, userId)
            .query(`
                SELECT 
                    COUNT(*) as TotalCourses,
                    AVG(progress) as AverageProgress,
                    COUNT(CASE WHEN progress >= 100 THEN 1 END) as CompletedCourses
                FROM dbo.Enrollments
                WHERE user_id = @user_id
            `);

        const dashboardData = {
            stats: {
                activeEnrollments: statsResult.recordset[0]?.TotalCourses || 0,
                completedAssignments: 0, // Tạm để 0
                averageScore: 0, // Tạm để 0 
                totalStudyTime: "0h" // Tạm để 0h
            },
            progressData: [
                { name: 'Tuần 1', progress: 20 },
                { name: 'Tuần 2', progress: 35 },
                { name: 'Tuần 3', progress: 45 },
                { name: 'Tuần 4', progress: 60 },
                { name: 'Tuần 5', progress: 67 }
            ],
            knowledgeGapData: [
                { subject: 'JavaScript', mastery: 85, gap: 15 },
                { subject: 'React', mastery: 70, gap: 30 },
                { subject: 'Node.js', mastery: 60, gap: 40 },
                { subject: 'Database', mastery: 45, gap: 55 },
                { subject: 'DevOps', mastery: 30, gap: 70 }
            ],
            recommendedPaths: [], // Sẽ được lấy từ API riêng
            aiPrediction: {
                status: 'success',
                cluster: 2,
                predicted_grade: 'Khá',
                probabilities: {
                    'Giỏi': 0.15,
                    'Khá': 0.65,
                    'Trung bình': 0.18,
                    'Yếu': 0.02
                }
            }
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
