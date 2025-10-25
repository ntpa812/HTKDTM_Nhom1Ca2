// src/routes/analytics.js
const express = require('express');
const router = express.Router();
const { poolPromise } = require('../utils/mssql');

router.get('/overview', async (req, res) => {
    try {
        const pool = await poolPromise;
        // Số khoá học
        const courseCount = await pool.request().query('SELECT COUNT(*) AS totalCourses FROM courses');
        // Tổng progress (số lượt học viên tham gia)
        const totalProgress = await pool.request().query('SELECT COUNT(*) AS totalProgress FROM progress');
        // Học viên/Khoá học (chart)
        const courseStudents = await pool.request().query(`
            SELECT c.title as name, COUNT(p.user_id) as students
            FROM courses c
            LEFT JOIN progress p ON c.id = p.course_id
            GROUP BY c.title
    `);

        res.json({
            totalCourses: courseCount.recordset[0].totalCourses,
            totalProgress: totalProgress.recordset[0].totalProgress,
            chart: courseStudents.recordset
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
