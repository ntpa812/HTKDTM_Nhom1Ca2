const express = require('express');  // ← THÊM DÒNG NÀY
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');

// Register routes
router.use('/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        routes: ['auth', 'health']
    });
});

// Placeholder cho các routes khác (sẽ implement sau)
router.get('/courses', (req, res) => {
    res.json({ success: true, message: 'Courses endpoint - Coming soon' });
});

router.get('/progress', (req, res) => {
    res.json({ success: true, message: 'Progress endpoint - Coming soon' });
});

router.get('/users', (req, res) => {
    res.json({ success: true, message: 'Users endpoint - Coming soon' });
});

router.get('/analytics', (req, res) => {
    res.json({ success: true, message: 'Analytics endpoint - Coming soon' });
});

router.get('/ai', (req, res) => {
    const express = require('express');
    const router = express.Router();

    // Debug: Load auth routes
    console.log('📂 Loading auth routes...');
    let authRoutes;
    try {
        authRoutes = require('./auth');
        console.log('✅ Auth routes loaded successfully:', typeof authRoutes);
    } catch (error) {
        console.error('❌ Failed to load auth routes:', error.message);
        authRoutes = express.Router();
        authRoutes.get('/', (req, res) => {
            res.status(500).json({ success: false, message: 'Auth routes failed to load' });
        });
    }

    // Register routes
    router.use('/auth', authRoutes);

    // Health check
    router.get('/health', (req, res) => {
        res.json({
            success: true,
            message: 'API is running',
            timestamp: new Date().toISOString()
        });
    });

    module.exports = router;

    res.json({ success: true, message: 'AI endpoint - Coming soon' });
});

module.exports = router;
