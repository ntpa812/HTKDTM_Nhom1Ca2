const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // ✅ DÙNG MySQL (mysql2/promise)

const JWT_SECRET = process.env.JWT_SECRET || 'smart_lms_secret_key_2024';
const JWT_EXPIRES_IN = '7d';

/* ======================================================
   POST /api/auth/login
   ====================================================== */
router.post('/login', async (req, res) => {
  console.log('📥 Login request body:', req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và password là bắt buộc'
      });
    }

    // 🔹 Truy vấn người dùng từ MySQL
    const [rows] = await pool.query(
      'SELECT id, username, email, password, full_name, role, learning_style FROM Users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const user = rows[0];
const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          learning_style: user.learning_style
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
});

/* ======================================================
   POST /api/auth/register
   ====================================================== */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email và password là bắt buộc'
      });
    }

    // 🔹 Kiểm tra user tồn tại
    const [checkUser] = await pool.query(
      'SELECT id FROM Users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (checkUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc username đã tồn tại'
      });
    }

    // 🔹 Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Tạo user mới
    const [result] = await pool.query(
      `INSERT INTO Users (username, email, password, full_name, role, created_at)
       VALUES (?, ?, ?, ?, 'student', NOW())`,
      [username, email, hashedPassword, full_name || username]
    );

    const user = {
      id: result.insertId,
      username,
      email,
      full_name: full_name || username,
      role: 'student',
    };

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: { user, token }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
});

module.exports = router;
