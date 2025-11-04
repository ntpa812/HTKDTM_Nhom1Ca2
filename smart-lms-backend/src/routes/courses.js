const express = require("express");
const pool = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log("[OK] Matched: GET /api/courses. Đang lấy danh sách khóa học...");
  try {
    const [rows] = await pool.query("SELECT * FROM Courses");
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách khóa học:", err.message);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách khóa học." });
  }
});


module.exports = router;
