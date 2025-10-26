const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../../config/database');

// JWT Secret (nên để trong .env)
const JWT_SECRET = process.env.JWT_SECRET || 'smart_lms_secret_key_2024';
const JWT_EXPIRES_IN = '7d';

// ============================================
// POST /api/auth/register - Đăng ký
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, full_name, learning_style } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email và password là bắt buộc'
            });
        }

        // Check if user exists
        const pool = await poolPromise;
        const checkUser = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('username', sql.NVarChar, username)
            .query('SELECT id FROM Users WHERE email = @email OR username = @username');

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email hoặc username đã tồn tại'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('full_name', sql.NVarChar, full_name || username)
            .input('role', sql.NVarChar, 'student')
            .input('learning_style', sql.NVarChar, learning_style || 'visual')
            .query(`
        INSERT INTO Users (username, email, password, full_name, role, learning_style, created_at)
        OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.full_name, INSERTED.role
        VALUES (@username, @email, @password, @full_name, @role, @learning_style, GETDATE())
      `);

        const user = result.recordset[0];

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                },
                token
            }
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

// ============================================
// POST /api/auth/login - Đăng nhập
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email và password là bắt buộc'
            });
        }

        // Find user
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(`
        SELECT id, username, email, password, full_name, role, learning_style 
        FROM Users 
        WHERE email = @email
      `);

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        const user = result.recordset[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Log activity
        try {
            await pool.request()
                .input('user_id', sql.Int, user.id)
                .input('event_type', sql.NVarChar, 'login')
                .input('event_data', sql.NVarChar, JSON.stringify({ ip: req.ip, userAgent: req.headers['user-agent'] }))
                .query(`
          INSERT INTO Analytics (user_id, event_type, event_data, timestamp)
          VALUES (@user_id, @event_type, @event_data, GETDATE())
        `);
        } catch (logError) {
            console.error('Failed to log activity:', logError);
        }

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

// ============================================
// GET /api/auth/me - Get current user info
// ============================================
router.get('/me', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user info
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, decoded.id)
            .query(`
        SELECT id, username, email, full_name, role, learning_style, created_at
        FROM Users 
        WHERE id = @id
