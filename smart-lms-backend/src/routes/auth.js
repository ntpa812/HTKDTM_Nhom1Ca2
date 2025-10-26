const express = require('express');
const router = express.Router();
const { poolPromise } = require('../utils/mssql');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', email)
            .query('SELECT * FROM users WHERE email = @email');
        const user = result.recordset[0];
        if (!user) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu!' });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu!' });
        }
        delete user.password;
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
