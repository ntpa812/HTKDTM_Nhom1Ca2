const express = require('express');
const router = express.Router();

// --- IMPORT CÁC ROUTE ---
const authRoutes = require('./auth');
const coursesRoutes = require('./courses');
const learningPathsRoutes = require('./learningPaths');
const analyticsRoutes = require('./analytics');
const dashboardRoutes = require('./dashboard');


// --- SỬ DỤNG CÁC ROUTE ---
router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);
router.use('/learning-paths', learningPathsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/dashboard', dashboardRoutes);

// --- HEALTH CHECK ROUTE ---
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running and healthy',
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;
