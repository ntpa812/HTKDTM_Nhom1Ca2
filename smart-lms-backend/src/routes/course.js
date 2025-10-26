const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database'); // ← FIX

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
        SELECT c.id, c.title, c.description, c.difficulty, c.duration_hours, c.category,
               u.full_name as instructor_name, c.created_at
        FROM Courses c
        LEFT JOIN Users u ON c.instructor_id = u.id
        ORDER BY c.created_at DESC
      `);

        res.json({
            success: true,
            data: {
                courses: result.recordset
            }
        });

    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

// GET /api/courses/:id - Get course by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
        SELECT c.*, u.full_name as instructor_name
        FROM Courses c
        LEFT JOIN Users u ON c.instructor_id = u.id
        WHERE c.id = @id
      `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Course không tồn tại'
            });
        }

        res.json({
            success: true,
            data: {
                course: result.recordset[0]
            }
        });

    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

module.exports = router;
