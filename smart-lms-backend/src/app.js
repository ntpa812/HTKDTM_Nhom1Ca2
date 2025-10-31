// smart-lms-backend/src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { poolPromise } = require('../config/database');

const app = express();

// ============================================
// MIDDLEWARE - PHẢI ĐẶT ĐÚNG THỨ TỰ
// ============================================
// 1. CORS TRƯỚC TIÊN
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. LOGGER
app.use(morgan('dev'));

// ============================================
// ROOT ENDPOINTS
// ============================================
app.get('/', (req, res) => {
    res.send('Smart LMS Backend API');
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT COUNT(*) as count FROM LearningPaths');

        res.json({
            success: true,
            message: 'Database connection OK',
            learning_paths_count: result.recordset[0].count,
            timestamp: new Date().toISOString()
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
// API ROUTES - SAU KHI MIDDLEWARE
// ============================================
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

// SỬA: Chỉ giữ 1 route cho learning paths
app.use('/api/learning-paths', require('./routes/learningPaths'));

// Loại bỏ duplicate
// app.use('/api/paths', require('./routes/learningPaths')); // XÓA DÒNG NÀY

app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/courses', require('./routes/courses'));

console.log('✅ All routes registered');

// ============================================
// ERROR HANDLERS
// ============================================
// 404 handler
app.use((req, res) => {
    console.log('❌ Route not found:', req.method, req.path);
    res.status(404).json({
        success: false,
        message: 'Route not found',
        method: req.method,
        path: req.path,
        available_routes: [
            'GET /api/test-db',
            'GET /api/learning-paths',
            'GET /api/learning-paths/categories',
            'POST /api/learning-paths/:id/enroll'
        ]
    });
});

// Phải có dòng này trong app.js
app.use('/api/learning-paths', require('./routes/learningPaths'));


// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
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
    console.log('📋 Available routes:');
    console.log('   - GET  /api/test-db');
    console.log('   - GET  /api/learning-paths');
    console.log('   - GET  /api/learning-paths/categories');
    console.log('   - POST /api/learning-paths/:id/enroll');
});

module.exports = app;
