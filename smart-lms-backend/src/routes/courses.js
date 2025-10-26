const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../config/database');

// GET all courses - SIMPLE VERSION
router.get('/', async (req, res) => {
    try {
        console.log('📚 Fetching courses...');
        const pool = await poolPromise;

        // Simple query without JOIN first
        const result = await pool.request().query(`
            SELECT 
                id,
                title,
                description,
                difficulty,
                duration_hours,
                category
            FROM Courses
            ORDER BY id DESC
            `);

        console.log(`✅ Found ${result.recordset.length} courses`);

        // Add enrolled_count = 0 for now
        const coursesWithCount = result.recordset.map(course => ({
            ...course,
            enrolled_count: 0
        }));

        res.json({
            success: true,
            count: coursesWithCount.length,
            data: coursesWithCount
        });
    } catch (error) {
        console.error('❌ Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách khóa học',
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;
