const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../config/database');

// GET all courses
router.get('/', async (req, res) => {
    try {
        console.log('📚 Fetching all courses...');
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT 
                c.id,
                c.title,
                c.description,
                c.difficulty,
                c.duration_hours,
                c.instructor_id,
                c.category,
                c.created_at,
                c.updated_at,
                COUNT(DISTINCT e.student_id) as enrolled_count
            FROM Courses c
            LEFT JOIN Enrollments e ON c.id = e.course_id
            GROUP BY c.id, c.title, c.description, c.difficulty, c.duration_hours, 
                    c.instructor_id, c.category, c.created_at, c.updated_at
            ORDER BY c.created_at DESC
            `);

        console.log(`✅ Found ${result.recordset.length} courses`);

        res.json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (error) {
        console.error('❌ Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách khóa học',
            error: error.message
        });
    }
});

// GET course by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📖 Fetching course with ID: ${id}`);

        const pool = await poolPromise;

        const result = await pool.request()
            .input('courseId', id)
            .query(`
                SELECT 
                c.*,
                COUNT(DISTINCT e.student_id) as enrolled_count
                FROM Courses c
                LEFT JOIN Enrollments e ON c.id = e.course_id
                WHERE c.id = @courseId
                GROUP BY c.id, c.title, c.description, c.difficulty, c.duration_hours, 
                        c.instructor_id, c.category, c.created_at, c.updated_at
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy khóa học'
            });
        }

        res.json({
            success: true,
            data: result.recordset[0]
        });
    } catch (error) {
        console.error('❌ Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin khóa học',
            error: error.message
        });
    }
});

module.exports = router;
