const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database');
const { authenticateToken } = require('../middleware/auth');

console.log('🚀 Khởi tạo routes cho Learning Paths...');

// Middleware để log các request đến route này
router.use((req, res, next) => {
    console.log(`🛣️  Request đến Learning Paths: ${req.method} ${req.originalUrl}`);
    next();
});

// GET /api/learning-paths/test - Route để kiểm tra
router.get('/test', (req, res) => {
    console.log('✅ Route test hoạt động!');
    res.json({
        success: true,
        message: 'Route Learning Paths đang hoạt động!',
        timestamp: new Date().toISOString()
    });
});

// GET /api/learning-paths/my-paths - Lấy các learning path của instructor đang đăng nhập
router.get('/my-paths', authenticateToken, async (req, res) => {
    if (req.user.role !== 'instructor') {
        return res.status(403).json({
            success: false,
            message: 'Quyền truy cập bị từ chối: Chỉ instructor mới có quyền này.'
        });
    }

    try {
        const instructorId = req.user.id;
        const pool = await poolPromise;
        const request = pool.request();
        request.input('owner_id', sql.Int, instructorId);

        const query = `
            SELECT 
                lp.id, lp.title, lp.slug, lp.description, lp.category, lp.difficulty,
                lp.is_published, lp.created_at, lp.updated_at,
                (SELECT COUNT(*) FROM PathCourses pc WHERE pc.path_id = lp.id) as courses_count,
                (SELECT COUNT(*) FROM PathEnrollments pe WHERE pe.path_id = lp.id) as enrollment_count
            FROM LearningPaths lp
            WHERE lp.owner_id = @owner_id
            ORDER BY lp.updated_at DESC;
        `;

        const result = await request.query(query);
        console.log(`✅ Lấy thành công ${result.recordset.length} learning paths cho instructor ID: ${instructorId}`);
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('❌ Lỗi khi lấy learning paths của instructor:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu.', error: error.message });
    }
});

// GET /api/learning-paths/categories - Lấy danh sách các category
router.get('/categories', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT DISTINCT category 
            FROM LearningPaths 
            WHERE is_published = 1 AND category IS NOT NULL
            ORDER BY category;
        `);
        const categories = result.recordset.map(row => row.category);
        console.log(`✅ Lấy thành công ${categories.length} categories.`);
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('❌ Lỗi khi lấy categories:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy categories.', error: error.message });
    }
});

// GET /api/learning-paths - Lấy tất cả learning path đã publish cho student
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                lp.id, lp.title, lp.description, lp.category, lp.difficulty, lp.estimated_hours,
                lp.created_at, u.full_name as instructor_name,
                (SELECT COUNT(*) FROM PathCourses pc WHERE pc.path_id = lp.id) as courses_count,
                (SELECT COUNT(*) FROM PathEnrollments pe WHERE pe.path_id = lp.id) as enrollment_count,
                4.5 as avg_rating, -- Mock
                50 as total_ratings, -- Mock
                0 as is_enrolled, -- Mock
                0 as user_progress -- Mock
            FROM LearningPaths lp
            LEFT JOIN Users u ON lp.owner_id = u.id
            WHERE lp.is_published = 1
            ORDER BY lp.created_at DESC;
        `);

        console.log(`✅ Lấy thành công ${result.recordset.length} learning paths cho student.`);
        res.json({
            success: true,
            message: 'Lấy danh sách learning paths thành công.',
            data: {
                paths: result.recordset,
                total: result.recordset.length
            }
        });
    } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách learning paths:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu.', error: error.message });
    }
});

console.log('✅ Tất cả routes cho Learning Paths đã được tải.');

module.exports = router;
