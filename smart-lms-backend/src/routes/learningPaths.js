// smart-lms-backend/src/routes/learningPaths.js
const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/paths/courses - lấy danh sách courses để add vào path
router.get('/courses', authenticateToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT id, title, category, difficulty, duration_hours, instructor_id
                FROM Courses 
                WHERE id NOT IN (
                    SELECT course_id FROM PathCourses WHERE path_id = @pathId
                )
                ORDER BY title
            `);

        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách courses',
            error: error.message
        });
    }
});

// POST /api/paths - tạo learning path mới
router.post('/', authenticateToken, authorizeRole('admin', 'instructor'), async (req, res) => {
    try {
        const { title, description, category, difficulty, estimated_hours, courses, prerequisites } = req.body;
        const userId = req.user.id;

        const pool = await poolPromise;
        const transaction = pool.transaction();

        await transaction.begin();

        // 1. Tạo Learning Path
        const pathResult = await transaction.request()
            .input('title', sql.NVarChar, title)
            .input('slug', sql.NVarChar, title.toLowerCase().replace(/[^a-z0-9]/g, '-'))
            .input('description', sql.NVarChar, description)
            .input('category', sql.NVarChar, category)
            .input('difficulty', sql.NVarChar, difficulty)
            .input('estimated_hours', sql.Int, estimated_hours)
            .input('owner_id', sql.Int, userId)
            .query(`
                INSERT INTO LearningPaths (title, slug, description, category, difficulty, estimated_hours, owner_id)
                OUTPUT INSERTED.id
                VALUES (@title, @slug, @description, @category, @difficulty, @estimated_hours, @owner_id)
            `);

        const pathId = pathResult.recordset[0].id;

        // 2. Add courses với thứ tự
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            await transaction.request()
                .input('path_id', sql.Int, pathId)
                .input('course_id', sql.Int, course.id)
                .input('position', sql.Int, i + 1)
                .input('min_score_required', sql.Decimal(5, 2), course.min_score_required || null)
                .input('require_quiz_complete', sql.Bit, course.require_quiz_complete || 0)
                .input('require_assignments_complete', sql.Bit, course.require_assignments_complete || 0)
                .query(`
                    INSERT INTO PathCourses (path_id, course_id, position, min_score_required, require_quiz_complete, require_assignments_complete)
                    VALUES (@path_id, @course_id, @position, @min_score_required, @require_quiz_complete, @require_assignments_complete)
                `);
        }

        // 3. Add prerequisites
        for (const prereq of prerequisites || []) {
            await transaction.request()
                .input('path_id', sql.Int, pathId)
                .input('course_id', sql.Int, prereq.course_id)
                .input('prerequisite_course_id', sql.Int, prereq.prerequisite_course_id)
                .input('min_score_required', sql.Decimal(5, 2), prereq.min_score_required || null)
                .query(`
                    INSERT INTO Prerequisites (path_id, course_id, prerequisite_course_id, min_score_required)
                    VALUES (@path_id, @course_id, @prerequisite_course_id, @min_score_required)
                `);
        }

        await transaction.commit();

        res.status(201).json({
            success: true,
            message: 'Learning path đã được tạo thành công',
            data: { id: pathId }
        });

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo learning path',
            error: error.message
        });
    }
});

module.exports = router;
