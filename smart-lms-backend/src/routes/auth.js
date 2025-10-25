const express = require('express');
const router = express.Router();
const { poolPromise } = require('../utils/mssql');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await poolPromise;
        // Lấy user theo email
        const result = await pool.request()
            .input('email', email)
            .query('SELECT * FROM users WHERE email = @email');
        const user = result.recordset[0];
        if (!user) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu!' });
        }
        // Ở đây chỉ so sánh password thuần (demo); thực tế nên mã hóa/hash
        if (user.password !== password) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu!' });
        }
        // Không trả mật khẩu về frontend!
        delete user.password;
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
