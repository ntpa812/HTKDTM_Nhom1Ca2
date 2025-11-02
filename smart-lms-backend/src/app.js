// ============================================
// SMART LMS BACKEND - app.js (FINAL VERSION)
// ============================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// --- CẤU HÌNH MIDDLEWARE ---
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- ĐĂNG KÝ CÁC API ROUTES ---
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/dashboard', require('./routes/dashboard'));
    app.use('/api/courses', require('./routes/courses'));
    app.use('/api/learning-paths', require('./routes/learningPaths'));
    app.use('/api/analytics', require('./routes/analytics'));
    console.log('✅ All API routes registered successfully.');
} catch (error) {
    console.error('❌ FATAL ERROR: Could not load routes.', error);
    process.exit(1);
}

// --- CÁC ROUTE CƠ BẢN (ROOT & TEST) ---
app.get('/', (req, res) => res.status(200).send('<h1>Smart LMS Backend API is running...</h1>'));
app.get('/api/test-db', async (req, res) => {
    try {
        const { poolPromise } = require('../config/database');
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT @@VERSION as version');
        res.status(200).json({ success: true, message: 'Database connection is OK.', data: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database connection failed.', error: error.message });
    }
});

// --- XỬ LÝ LỖI (ERROR HANDLING) ---
app.use((req, res, next) => res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((err, req, res, next) => {
    console.error('❌ UNHANDLED ERROR:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'An unexpected internal server error occurred.',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// --- KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server is listening on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
