const express = require('express');
const router = express.Router();
const sql = require('mssql');
const authMiddleware = require('../middleware/auth');
const { getAIPrediction } = require('../services/aiService'); // <-- IMPORT HÀM HELPER MỚI

// @route   GET /api/dashboard
// @desc    Lấy dữ liệu dashboard cho sinh viên đăng nhập
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // --- 1. LẤY DỮ LIỆU DASHBOARD HIỆN TẠI (giữ nguyên logic của bạn) ---
        // Ví dụ: lấy các khóa học đã đăng ký
        const enrolledCoursesResult = await sql.query`
            SELECT c.ID, c.Title, c.Category, e.Progress, c.ThumbnailURL
            FROM Enrollments e
            JOIN Courses c ON e.CourseID = c.ID
            WHERE e.UserID = ${userId}
        `;

        // Ví dụ: lấy các thông số tổng quan
        const statsResult = await sql.query`
            SELECT 
                COUNT(*) as TotalCourses,
                AVG(Progress) as AverageProgress
            FROM Enrollments
            WHERE UserID = ${userId}
        `;

        // --- 2. GỌI HÀM LẤY DỮ LIỆU DỰ ĐOÁN TỪ AI ---
        const aiPrediction = await getAIPrediction(userId);

        // --- 3. TỔNG HỢP VÀ TRẢ VỀ KẾT QUẢ ---
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
            // Thêm mục aiPrediction vào kết quả trả về
            // Nếu không có dự đoán, nó sẽ là null
            aiPrediction: aiPrediction
        };

        res.json(dashboardData);

    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
