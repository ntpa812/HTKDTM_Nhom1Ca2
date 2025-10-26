const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const coursesRoutes = require('./courses');
// const dashboardRoutes = require('./dashboard'); // ← Make sure this line exists

router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);
// router.use('/dashboard', dashboardRoutes); // ← Make sure this line exists

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
