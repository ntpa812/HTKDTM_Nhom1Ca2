// src/routes/courses.js
const express = require('express');
const router = express.Router();
const { poolPromise } = require('../utils/mssql');

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT id, title, difficulty FROM courses');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
