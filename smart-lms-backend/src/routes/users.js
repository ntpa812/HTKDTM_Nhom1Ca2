const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // ← FIX: 2 dấu ..
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT id, username, email, full_name, role, learning_style, created_at FROM Users ORDER BY id');

        res.json({
            success: true,
            data: {
                users: result.recordset
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT id, username, email, full_name, role, learning_style, created_at FROM Users WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User không tồn tại'
            });
        }

        res.json({
            success: true,
            data: {
                user: result.recordset[0]
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

module.exports = router;
