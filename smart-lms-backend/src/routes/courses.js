const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database');
const { authenticateToken } = require('../middleware/auth');

// === ROUTE 1: LẤY TẤT CẢ KHÓA HỌC ===
// GET /api/courses
router.get('/', authenticateToken, async (req, res) => {
    console.log(`[OK] Matched: GET /api/courses. Đang lấy danh sách khóa học...`);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT c.*, u.full_name as instructor_name
            FROM dbo.Courses c
            LEFT JOIN dbo.Users u ON c.instructor_id = u.id
            ORDER BY c.id;
        `);
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách khóa học:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách khóa học.' });
    }
});

// === ROUTE 2: LẤY CHI TIẾT MỘT KHÓA HỌC ===
// GET /api/courses/:id
router.get('/:id', authenticateToken, async (req, res) => {
    const { id: courseId } = req.params;
    console.log(`[OK] Matched: GET /api/courses/:id. Đang lấy chi tiết khóa học ID: ${courseId}`);

    try {
        const pool = await poolPromise;

        // Lấy thông tin khóa học
        const courseRequest = pool.request().input('courseId', sql.Int, courseId);
        const courseResult = await courseRequest.query(`
            SELECT c.id, c.title, c.description, c.difficulty, c.duration_hours, c.category, u.full_name AS instructor_name
            FROM dbo.Courses c
            JOIN dbo.Users u ON c.instructor_id = u.id
            WHERE c.id = @courseId;
        `);

        if (courseResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học.' });
        }
        const courseData = courseResult.recordset[0];

        // Lấy danh sách bài học
        const lessonsRequest = pool.request().input('courseId', sql.Int, courseId);
        const lessonsResult = await lessonsRequest.query(`
            SELECT id, title, duration_minutes, is_preview_allowed
            FROM dbo.Lessons
            WHERE course_id = @courseId
            ORDER BY position ASC;
        `);

        courseData.lessons = lessonsResult.recordset;

        res.json({ success: true, data: courseData });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy chi tiết khóa học.', error: error.message });
    }
});

module.exports = router;
