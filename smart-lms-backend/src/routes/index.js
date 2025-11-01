const express = require('express');
const router = express.Router();

// --- IMPORT CÁC ROUTE ---
const authRoutes = require('./auth');
const coursesRoutes = require('./courses');
const learningPathsRoutes = require('./learningPaths');
const analyticsRoutes = require('./analytics');
// Bạn có thể import thêm các route khác như progress, users, ai ở đây khi cần

// --- SỬ DỤNG CÁC ROUTE ---
router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);
router.use('/learning-paths', learningPathsRoutes);
router.use('/analytics', analyticsRoutes);

// --- HEALTH CHECK ROUTE ---
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running and healthy',
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;
