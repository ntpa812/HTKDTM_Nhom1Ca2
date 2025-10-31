const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database');
const { authenticateToken } = require('../middleware/auth');

// --- CÁC ROUTE TĨNH (STATIC ROUTES) ---
// (Các route /my-paths, /categories, / không thay đổi, giữ nguyên như cũ)
router.get('/my-paths', authenticateToken, async (req, res) => { /*...*/ });
router.get('/categories', async (req, res) => { /*...*/ });
router.get('/', async (req, res) => { /*...*/ });

// --- ROUTE ĐỘNG (DYNAMIC ROUTE) - ĐÃ ĐƯỢC NÂNG CẤP ---
// GET /api/learning-paths/:id - Lấy chi tiết một learning path, bao gồm trạng thái khóa học cho user
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id: pathId } = req.params;
        const { id: userId } = req.user; // Lấy userId từ token đã xác thực
        const pool = await poolPromise;

        // 1. Lấy thông tin chính của learning path
        const pathResult = await pool.request()
            .input('id', sql.Int, pathId)
            .query(`
                SELECT lp.id, lp.title, lp.description, lp.category, lp.difficulty, lp.estimated_hours,
                       u.full_name as instructor_name
                FROM LearningPaths lp JOIN Users u ON lp.owner_id = u.id
                WHERE lp.id = @id AND lp.is_published = 1;
            `);

        if (pathResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy Learning Path.' });
        }
        const learningPath = pathResult.recordset[0];

        // 2. Lấy TOÀN BỘ khóa học trong path, sắp xếp theo thứ tự
        const allCoursesResult = await pool.request()
            .input('path_id', sql.Int, pathId)
            .query('SELECT c.id, c.title, c.description, pc.position FROM PathCourses pc JOIN Courses c ON pc.course_id = c.id WHERE pc.path_id = @path_id ORDER BY pc.position ASC;');
        const allCourses = allCoursesResult.recordset;

        // 3. Lấy TIẾN ĐỘ của user trong path này
        const progressResult = await pool.request()
            .input('path_id', sql.Int, pathId)
            .input('user_id', sql.Int, userId)
            .query('SELECT course_id, completed, progress FROM PathProgress WHERE path_id = @path_id AND user_id = @user_id;');

        // Tạo một map để tra cứu tiến độ nhanh hơn
        const progressMap = new Map(progressResult.recordset.map(p => [p.course_id, p]));

        // 4. Tính toán trạng thái (isLocked, completionStatus) cho từng khóa học
        let previousCourseCompleted = true; // Khóa đầu tiên luôn được mở
        learningPath.courses = allCourses.map(course => {
            const userProgress = progressMap.get(course.id);
            let status = 'locked';
            const isLocked = !previousCourseCompleted;

            if (!isLocked) {
                if (userProgress?.completed) {
                    status = 'completed';
                } else if (userProgress && userProgress.progress > 0) {
                    status = 'in_progress';
                } else {
                    status = 'not_started';
                }
            }

            // Cập nhật điều kiện để mở khóa học tiếp theo
            previousCourseCompleted = (status === 'completed');

            return {
                ...course,
                isLocked,
                status, // 'locked', 'not_started', 'in_progress', 'completed'
                progress: userProgress?.progress || 0
            };
        });

        res.json({ success: true, data: learningPath });

    } catch (error) {
        console.error('❌ Lỗi khi lấy chi tiết learning path:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu chi tiết.', error: error.message });
    }
});

module.exports = router;
