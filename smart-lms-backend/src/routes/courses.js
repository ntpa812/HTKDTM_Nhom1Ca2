const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../config/database');
const { authenticateToken } = require('../middleware/auth');

// === ROUTE 1: LẤY TẤT CẢ KHÓA HỌC (PUBLIC TEST) ===
// GET /api/courses/public
router.get('/public', async (req, res) => {
  console.log(`[PUBLIC] GET /api/courses/public - đang lấy danh sách khóa học (MySQL)`);

  try {
    const pool = await poolPromise;
    const [rows] = await pool.query(`
      SELECT c.*, u.full_name AS instructor_name
      FROM Courses c
      LEFT JOIN Users u ON c.instructor_id = u.id
      ORDER BY c.id;
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách khóa học (public):', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// === ROUTE 2: LẤY TẤT CẢ KHÓA HỌC (CÓ TOKEN) ===
// GET /api/courses
router.get('/', authenticateToken, async (req, res) => {
  console.log(`[OK] Matched: GET /api/courses. Đang lấy danh sách khóa học...`);
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query(`
      SELECT c.*, u.full_name AS instructor_name
      FROM Courses c
      LEFT JOIN Users u ON c.instructor_id = u.id
      ORDER BY c.id;
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách khóa học:', error.message);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách khóa học.' });
  }
});

// === ROUTE 3: LẤY CHI TIẾT MỘT KHÓA HỌC ===
// GET /api/courses/:id
router.get('/:id', authenticateToken, async (req, res) => {
  const { id: courseId } = req.params;
  console.log(`[OK] Matched: GET /api/courses/:id. Đang lấy chi tiết khóa học ID: ${courseId}`);

  try {
    const pool = await poolPromise;

    // Lấy thông tin khóa học
    const [courseResult] = await pool.query(
      `SELECT c.*, u.full_name AS instructor_name
       FROM Courses c
       LEFT JOIN Users u ON c.instructor_id = u.id
       WHERE c.id = ?`,
      [courseId]
    );

    if (courseResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học.' });
    }
    const courseData = courseResult[0];

    // Lấy danh sách bài học
    const [lessonsResult] = await pool.query(
      `SELECT id, title, duration_minutes, is_preview_allowed, description
       FROM Lessons
       WHERE course_id = ?
       ORDER BY position ASC`,
      [courseId]
    );

    courseData.lessons = lessonsResult;

    res.json({ success: true, data: courseData });
  } catch (error) {
    console.error('❌ Lỗi khi lấy chi tiết khóa học:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
