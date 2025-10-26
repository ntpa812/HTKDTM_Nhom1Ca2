require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { poolPromise } = require('../config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Root
app.get('/', (req, res) => res.send('Smart LMS Backend API'));

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT @@VERSION AS version');
        res.json({
            success: true,
            message: 'Database connected',
            version: result.recordset && result.recordset[0] ? result.recordset[0].version : null
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message || err });
    }
});

// Register routes (index.js mounts /api/auth, /api/courses, /api/progress, /api/ai)
require('./routes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;