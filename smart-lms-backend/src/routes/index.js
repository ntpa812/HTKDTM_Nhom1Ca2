const express = require('express');
const router = express.Router();

// --- IMPORT CÁC ROUTE ---
const authRoutes = require('./auth');
const coursesRoutes = require('./courses');
const learningPathsRoutes = require('./learningPaths');
const analyticsRoutes = require('./analytics');

// --- SỬ DỤNG CÁC ROUTE ---
router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);
router.use('/learning-paths', learningPathsRoutes);
router.use('/analytics', analyticsRoutes);

// Health check (cập nhật để hiển thị route mới)
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
            '/api/learning-paths',
            '/api/learning-paths/recommendations',
            '/api/progress',
            '/api/users',
            '/api/analytics',
            '/api/ai'
        ]
    });
});

// Placeholder routes for future features
// router.get('/progress', (req, res) => {
//     res.json({
//         success: true,
//         message: 'Progress endpoint - Coming soon'
//     });
// });

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
