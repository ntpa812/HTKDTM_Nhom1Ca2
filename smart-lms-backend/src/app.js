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
        const result = await pool.request().query('SELECT @@VERSION AS version');
        res.json({
            success: true,
            message: 'Database connected',
            version: result.recordset && result.recordset[0] ? result.recordset[0].version : null
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message || err
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
// smart-lms-backend/src/app.js
app.use('/api/paths', require('./routes/learningPaths'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/courses', require('./routes/courses'));

// ============================================
// ERROR HANDLERS
// ============================================
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});

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
});

module.exports = app;
