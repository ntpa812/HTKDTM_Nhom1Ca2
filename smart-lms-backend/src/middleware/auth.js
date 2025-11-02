// File: smart-lms-backend/src/routes/auth.js (FINAL, CORRECTED VERSION)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql'); // Sử dụng sql trực tiếp để có IntelliSense tốt hơn
const { poolPromise } = require('../../config/database'); // Đảm bảo đường dẫn này đúng

const JWT_SECRET = process.env.JWT_SECRET || 'smart_lms_secret_key_2024_fallback';

// @route   POST /api/auth/login
// @desc    Xác thực người dùng và trả về token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`📥 Login request body:`, { email, password: '***' });

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email và mật khẩu.' });
    }

    try {
        // Lấy connection pool
        const pool = await poolPromise;
        if (!pool) {
            throw new Error('Database connection pool is not available.');
        }

        // Tạo một request mới từ pool
        const request = pool.request();

        // Truy vấn CSDL một cách an toàn để tìm user bằng email
        const result = await request
            .input('Email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @Email');

        const user = result.recordset[0];

        // Kiểm tra xem user có tồn tại không
        if (!user) {
            return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
        }

        // So sánh mật khẩu đã hash
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
        }

        // Nếu mật khẩu khớp, tạo JWT token
        const payload = {
            user: {
                id: user.ID,
                username: user.Username,
                role: user.Role,
                fullName: user.FullName
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '7d' }, // Token hết hạn sau 7 ngày
            (err, token) => {
                if (err) throw err;

                // Trả về token và thông tin user
                res.json({
                    success: true,
                    message: 'Đăng nhập thành công!',
                    token,
                    user: payload.user
                });
            }
        );

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi đăng nhập.',
            error: error.message
        });
    }
});


// Middleware xác thực token (để dùng cho các route khác)
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Token format is invalid' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = router;
// Export cả middleware để các file khác có thể dùng
module.exports.authenticateToken = authenticateToken; 
