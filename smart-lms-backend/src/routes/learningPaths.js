const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database');
const { authenticateToken } = require('../middleware/auth');

// --- CÁC ROUTE TĨNH (STATIC ROUTES) ---
// Phải được định nghĩa trước các route động như /:id

// GET /api/learning-paths/my-paths - Lấy learning path của instructor
router.get('/my-paths', authenticateToken, async (req, res) => {
    if (req.user.role !== 'instructor') {
        return res.status(403).json({ success: false, message: 'Quyền truy cập bị từ chối.' });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('owner_id', sql.Int, req.user.id)
            .query(`
                SELECT lp.id, lp.title, lp.is_published, lp.updated_at,
                       (SELECT COUNT(*) FROM PathCourses WHERE path_id = lp.id) as courses_count,
                       (SELECT COUNT(*) FROM PathEnrollments WHERE path_id = lp.id) as enrollment_count
                FROM LearningPaths lp WHERE lp.owner_id = @owner_id ORDER BY lp.updated_at DESC;
            `);
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy learning path của bạn.', error: error.message });
    }
});

// GET /api/learning-paths/categories - Lấy danh sách các category
router.get('/categories', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT DISTINCT category FROM LearningPaths WHERE is_published = 1 AND category IS NOT NULL ORDER BY category;');
        res.json({ success: true, data: result.recordset.map(row => row.category) });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy categories.', error: error.message });
    }
});


// --- ROUTE GỐC (ROOT) ---
// GET /api/learning-paths - Lấy danh sách learning path cho student
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT lp.id, lp.slug, lp.title, lp.description, lp.category, lp.difficulty, lp.estimated_hours, lp.created_at,
                   u.full_name as instructor_name
            FROM LearningPaths lp JOIN Users u ON lp.owner_id = u.id
            WHERE lp.is_published = 1 ORDER BY lp.created_at DESC;
        `);
        res.json({ success: true, data: { paths: result.recordset } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách learning path.', error: error.message });
    }
});


// --- ROUTE ĐỘNG (DYNAMIC ROUTE) ---
// Phải đặt cuối cùng để không xung đột với các route tĩnh ở trên

// GET /api/learning-paths/:id - Lấy chi tiết một learning path bằng ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        // Sửa lỗi: Đã xóa dấu phẩy thừa ở cuối dòng "u.full_name as instructor_name"
        const pathQuery = `
            SELECT lp.id, lp.title, lp.description, lp.category, lp.difficulty, lp.estimated_hours,
                   u.full_name as instructor_name
            FROM LearningPaths lp JOIN Users u ON lp.owner_id = u.id
            WHERE lp.id = @id AND lp.is_published = 1;
        `;

        const pathResult = await pool.request()
            .input('id', sql.Int, id)
            .query(pathQuery);

        if (pathResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy Learning Path.' });
        }
        const learningPath = pathResult.recordset[0];

        // Lấy danh sách khóa học
        const coursesResult = await pool.request()
            .input('path_id', sql.Int, learningPath.id)
            .query('SELECT c.title, c.description, pc.position FROM PathCourses pc JOIN Courses c ON pc.course_id = c.id WHERE pc.path_id = @path_id ORDER BY pc.position ASC;');
        learningPath.courses = coursesResult.recordset;

        // Mock reviews (tạm thời)
        learningPath.reviews = [];

        res.json({ success: true, data: learningPath });
    } catch (error) {
        console.error('❌ Lỗi khi lấy chi tiết learning path:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu chi tiết.', error: error.message });
    }
});

module.exports = router;
