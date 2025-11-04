const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

// GET /api/learning-paths
router.get("/", async (req, res) => {
  console.log("[OK] Matched: GET /api/learning-paths. Đang lấy danh sách lộ trình...");
  try {
    const [rows] = await pool.query("SELECT * FROM LearningPaths");
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách learning paths:", err.message);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách learning paths." });
  }
});

module.exports = router;
