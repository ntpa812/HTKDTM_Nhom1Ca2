const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'smart_lms_secret_key_2024';
const JWT_EXPIRES_IN = '7d';

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email và password là bắt buộc'
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT id, username, email, password, full_name, role, learning_style FROM Users WHERE email = @email');

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        const user = result.recordset[0];
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

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, full_name } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email và password là bắt buộc'
            });
        }

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

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('full_name', sql.NVarChar, full_name || username)
            .query(`
        INSERT INTO Users (username, email, password, full_name, role, created_at)
        OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.full_name, INSERTED.role
        VALUES (@username, @email, @password, @full_name, 'student', GETDATE())
      `);

        const user = result.recordset[0];

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
