const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../config/database');
const { authenticateToken: auth } = require('../middleware/auth');

// GET Dashboard Stats (Mock for now)
router.get('/stats', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                activeEnrollments: 5,
                completedAssignments: 24,
                averageScore: '8.5',
                totalStudyTime: '42h'
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê dashboard',
            error: error.message
        });
    }
});

// Mock endpoints
router.get('/progress', auth, async (req, res) => {
    res.json({
        success: true,
        data: [
            { name: 'T1', progress: 30 },
            { name: 'T2', progress: 45 },
            { name: 'T3', progress: 60 },
            { name: 'T4', progress: 75 }
        ]
    });
});

router.get('/knowledge-gap', auth, async (req, res) => {
    res.json({
        success: true,
        data: [
            { subject: 'Toán', mastery: 85, gap: 15 },
            { subject: 'Lập trình', mastery: 70, gap: 30 },
            { subject: 'CSDL', mastery: 90, gap: 10 },
            { subject: 'AI/ML', mastery: 60, gap: 40 }
        ]
    });
});

router.get('/recommendations', auth, async (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, title: 'Deep Learning cơ bản', difficulty: 'Trung bình', match: 92 },
            { id: 2, title: 'Python nâng cao', difficulty: 'Khó', match: 88 },
            { id: 3, title: 'Data Structures', difficulty: 'Dễ', match: 85 }
        ]
    });
});

router.get('/activities', auth, async (req, res) => {
    res.json({
        success: true,
        data: []
    });
});

router.get('/deadlines', auth, async (req, res) => {
    res.json({
        success: true,
        data: []
    });
});

router.get('/metrics', auth, async (req, res) => {
    res.json({
        success: true,
        data: {
            averageScore: 85.5,
            classAverage: 78.2,
            completionRate: 72,
            targetCompletionRate: 80,
            studyTimeToday: 3.5,
            studyTimeGoal: 4,
            engagementScore: 88,
            badges: 12,
            totalBadges: 20,
            streak: 7,
            bestStreak: 14,
            performanceTrend: 'up',
            recentAchievements: [
                { id: 1, name: 'Người học nhanh', icon: '⚡', date: '2 ngày trước' },
                { id: 2, name: 'Bậc thầy Quiz', icon: '🎯', date: '5 ngày trước' },
                { id: 3, name: 'Chuỗi 7 ngày', icon: '🔥', date: '1 ngày trước' }
            ]
        }
    });
});

// ... (giữ nguyên toàn bộ các route /stats, /progress, ... của bạn)

// ============================================
// API MỚI CHO DỰ ĐOÁN AI
// ============================================
// @route   GET /api/dashboard/ai-prediction
// @desc    Lấy kết quả dự đoán từ AI cho sinh viên đăng nhập
// @access  Private

const { getAIPrediction } = require('../services/aiService'); // Đảm bảo bạn có dòng này

router.get('/ai-prediction', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Gọi hàm service để lấy dự đoán
        const prediction = await getAIPrediction(userId);

        if (!prediction) {
            return res.status(404).json({
                success: false,
                message: 'Không đủ dữ liệu hành vi để tạo dự đoán.'
            });
        }

        res.json({
            success: true,
            data: prediction
        });

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu dự đoán AI:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi thực hiện dự đoán.',
            error: error.message
        });
    }
});

module.exports = router;
