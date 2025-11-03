const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth'); // Your auth middleware

// Add request timing middleware
router.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

/**
 * @route GET /api/ai/student/:userId/prediction
 * @desc Get AI prediction for specific student
 * @access Private (Student can only access own data, Admin can access all)
 */
router.get('/student/:userId/prediction', authMiddleware, (req, res, next) => {
  // Authorization check
  const requestingUserId = req.user.id;
  const targetUserId = parseInt(req.params.userId);

  if (req.user.role !== 'admin' && requestingUserId !== targetUserId) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'You can only access your own prediction data'
    });
  }

  next();
}, aiController.getStudentPrediction);

/**
 * @route GET /api/ai/analytics/:userId
 * @desc Get AI analytics and trends for student
 * @access Private
 */
router.get('/analytics/:userId', authMiddleware, aiController.getStudentAnalytics);

/**
 * @route POST /api/ai/predict/bulk
 * @desc Bulk predict for multiple students (Admin only)
 * @access Admin
 */
router.post('/predict/bulk', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required for bulk predictions'
    });
  }
  next();
}, aiController.bulkPredict);

/**
 * @route POST /api/ai/predict/custom
 * @desc Custom prediction with provided data
 * @access Private
 */
router.post('/predict/custom', authMiddleware, aiController.customPredict);

/**
 * @route GET /api/ai/health
 * @desc Health check for AI service
 * @access Public (or Admin only, depending on your needs)
 */
router.get('/health', aiController.healthCheck);

module.exports = router;
