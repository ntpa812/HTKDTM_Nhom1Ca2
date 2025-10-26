const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./auth');
const coursesRoutes = require('./courses');

// Register routes
router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        availableRoutes: [
            '/api/health',
            '/api/auth/login',
            '/api/auth/register',
            '/api/courses',
            '/api/progress',
            '/api/users',
            '/api/analytics',
            '/api/ai'
        ]
    });
});

// Placeholder routes for future features
router.get('/progress', (req, res) => {
    res.json({
        success: true,
        message: 'Progress endpoint - Coming soon'
    });
});

router.get('/users', (req, res) => {
    res.json({
        success: true,
        message: 'Users endpoint - Coming soon'
    });
});

router.get('/analytics', (req, res) => {
    res.json({
        success: true,
        message: 'Analytics endpoint - Coming soon'
    });
});

router.get('/ai', (req, res) => {
    res.json({
        success: true,
        message: 'AI endpoint - Coming soon'
    });
});

module.exports = router;
