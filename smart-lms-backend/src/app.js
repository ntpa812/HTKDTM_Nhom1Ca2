// smart-lms-backend/src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { poolPromise } = require('../config/database');

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ============================================
// API ROUTES
// ============================================

// Các routes chính
app.use('/api', require('./routes'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/learning-paths', require('./routes/learningPaths'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/courses', require('./routes/courses'));

// Route cho AI
app.use('/api/ai', require('./routes/ai')); // Sửa lại đường dẫn và chỉ cần 1 dòng

console.log('✅ All routes registered');

// ============================================
// ROOT & TEST ENDPOINTS
// ============================================
app.get('/', (req, res) => {
    res.send('Smart LMS Backend API');
});

app.get('/api/test-db', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT COUNT(*) as count FROM Users');
        res.json({
            success: true,
            message: 'Database connection OK',
            users_count: result.recordset[0].count,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// ============================================
// ERROR HANDLERS
// ============================================
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        method: req.method,
        path: req.path,
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Global Error Handler:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;
