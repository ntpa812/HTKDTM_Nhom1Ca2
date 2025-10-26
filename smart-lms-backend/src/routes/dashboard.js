const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/database');
const auth = require('../middleware/auth');

// GET Dashboard Stats
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise;

        // Count active enrollments
        const enrollmentsResult = await pool.request()
            .input('userId', userId)
            .query(`
        SELECT COUNT(*) as activeEnrollments
        FROM Enrollments
        WHERE student_id = @userId
      `);

        // Calculate average progress as "score"
        const progressResult = await pool.request()
            .input('userId', userId)
            .query(`
        SELECT AVG(CAST(progress as FLOAT)) as averageProgress
        FROM Progress
        WHERE student_id = @userId
      `);

        // Count completed courses (progress >= 100)
        const completedResult = await pool.request()
            .input('userId', userId)
            .query(`
        SELECT COUNT(*) as completedCourses
        FROM Enrollments
        WHERE student_id = @userId AND progress >= 100
      `);

        // Calculate total study time from Progress
        const studyTimeResult = await pool.request()
            .input('userId', userId)
            .query(`
        SELECT SUM(time_spent) as totalMinutes
        FROM Progress
        WHERE student_id = @userId
      `);

        const totalHours = Math.round((studyTimeResult.recordset[0].totalMinutes || 0) / 60);

        res.json({
            success: true,
            data: {
                activeEnrollments: enrollmentsResult.recordset[0].activeEnrollments || 0,
                completedAssignments: completedResult.recordset[0].completedCourses || 0,
                averageScore: (progressResult.recordset[0].averageProgress || 0).toFixed(1),
                totalStudyTime: totalHours + 'h'
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

// GET Progress Data (for chart)
router.get('/progress', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('userId', userId)
            .query(`
        SELECT 
          MONTH(updated_at) as month,
          AVG(progress) as avgProgress
        FROM Enrollments
        WHERE student_id = @userId
          AND updated_at >= DATEADD(MONTH, -4, GETDATE())
        GROUP BY MONTH(updated_at)
        ORDER BY MONTH(updated_at)
      `);

        const months = ['T1', 'T2', 'T3', 'T4'];
        const progressData = result.recordset.length > 0
            ? result.recordset.map((row, index) => ({
                name: months[index] || `T${index + 1}`,
                progress: Math.round(row.avgProgress || 0)
            }))
            : [
                { name: 'T1', progress: 30 },
                { name: 'T2', progress: 45 },
                { name: 'T3', progress: 60 },
                { name: 'T4', progress: 75 }
            ];

        res.json({
            success: true,
            data: progressData
        });
    } catch (error) {
        console.error('Error fetching progress data:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu tiến độ',
            error: error.message
        });
    }
});

// GET Knowledge Gap Data (based on course categories)
router.get('/knowledge-gap', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('userId', userId)
            .query(`
        SELECT TOP 4
          c.category as subject,
          AVG(e.progress) as mastery,
          100 - AVG(e.progress) as gap
        FROM Enrollments e
        JOIN Courses c ON e.course_id = c.id
        WHERE e.student_id = @userId
        GROUP BY c.category
        ORDER BY AVG(e.progress) ASC
      `);

        const knowledgeGapData = result.recordset.length > 0
            ? result.recordset.map(row => ({
                subject: row.subject || 'Chưa phân loại',
                mastery: Math.round(row.mastery || 0),
                gap: Math.round(row.gap || 0)
            }))
            : [
                { subject: 'Toán', mastery: 85, gap: 15 },
                { subject: 'Lập trình', mastery: 70, gap: 30 },
                { subject: 'CSDL', mastery: 90, gap: 10 },
                { subject: 'AI/ML', mastery: 60, gap: 40 }
            ];

        res.json({
            success: true,
            data: knowledgeGapData
        });
    } catch (error) {
        console.error('Error fetching knowledge gap:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy phân tích lỗ hổng kiến thức',
            error: error.message
        });
    }
});

// GET Recommended Courses (from Recommendations table)
router.get('/recommendations', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('userId', userId)
            .query(`
        SELECT TOP 3
          c.id,
          c.title,
          c.level as difficulty,
          r.score as match
        FROM Recommendations r
        JOIN Courses c ON r.course_id = c.id
        WHERE r.student_id = @userId
        ORDER BY r.score DESC
      `);

        const recommendations = result.recordset.length > 0
            ? result.recordset.map(row => ({
                id: row.id,
                title: row.title,
                difficulty: row.difficulty === 'beginner' ? 'Dễ' :
                    row.difficulty === 'intermediate' ? 'Trung bình' : 'Khó',
                match: Math.round(row.match || 90)
            }))
            : [
                { id: 1, title: 'Deep Learning cơ bản', difficulty: 'Trung bình', match: 92 },
                { id: 2, title: 'Python nâng cao', difficulty: 'Khó', match: 88 },
                { id: 3, title: 'Data Structures', difficulty: 'Dễ', match: 85 }
            ];

        res.json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy khóa học đề xuất',
            error: error.message
        });
    }
});

// GET Recent Activities (from Enrollments + Progress)
router.get('/activities', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('userId', userId)
            .query(`
        SELECT TOP 5
          'enrollment' as type,
          c.title as title,
          'Đã đăng ký khóa học' as action,
          e.created_at as timestamp
        FROM Enrollments e
        JOIN Courses c ON e.course_id = c.id
        WHERE e.student_id = @userId
        
        UNION ALL
        
        SELECT TOP 5
          'progress' as type,
          c.title as title,
          'Học xong bài: ' + p.lesson_title as action,
          p.updated_at as timestamp
        FROM Progress p
        JOIN Courses c ON p.course_id = c.id
        WHERE p.student_id = @userId AND p.completed = 1
        
        ORDER BY timestamp DESC
      `);

        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy hoạt động gần đây',
            error: error.message
        });
    }
});

// GET Upcoming Deadlines (mock data for now - sẽ thêm sau)
router.get('/deadlines', auth, async (req, res) => {
    try {
        // Mock data since no deadline tables yet
        res.json({
            success: true,
            data: [
                {
                    id: 1,
                    title: 'Quiz: React Fundamentals',
                    type: 'quiz',
                    course: 'Web Development',
                    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                    isCompleted: false
                },
                {
                    id: 2,
                    title: 'Bài tập: Xây dựng REST API',
                    type: 'assignment',
                    course: 'Backend Development',
                    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                    isCompleted: false
                }
            ]
        });
    } catch (error) {
        console.error('Error fetching deadlines:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy deadlines',
            error: error.message
        });
    }
});

// GET Performance Metrics
router.get('/metrics', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise;

        // Average Progress as score
        const scoreResult = await pool.request()
            .input('userId', userId)
            .query(`
        SELECT 
          AVG(CAST(e1.progress as FLOAT)) as averageScore,
          (SELECT AVG(CAST(progress as FLOAT)) FROM Enrollments) as classAverage
        FROM Enrollments e1
        WHERE e1.student_id = @userId
      `);

        // Completion Rate
        const completionResult = await pool.request()
            .input('userId', userId)
            .query(`
        SELECT 
          CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE COUNT(CASE WHEN progress >= 100 THEN 1 END) * 100.0 / COUNT(*)
          END as completionRate
        FROM Enrollments
        WHERE student_id = @userId
      `);

        // Study Time Today
        const studyTimeResult = await pool.request()
            .input('userId', userId)
            .input('today', new Date().toISOString().split('T')[0])
            .query(`
        SELECT 
          ISNULL(SUM(time_spent) / 60.0, 0) as studyTimeToday
        FROM Progress
        WHERE student_id = @userId 
          AND CAST(updated_at as DATE) = @today
      `);

        res.json({
            success: true,
            data: {
                averageScore: parseFloat((scoreResult.recordset[0].averageScore || 0).toFixed(1)),
                classAverage: parseFloat((scoreResult.recordset[0].classAverage || 0).toFixed(1)),
                completionRate: Math.round(completionResult.recordset[0].completionRate || 0),
                targetCompletionRate: 80,
                studyTimeToday: parseFloat((studyTimeResult.recordset[0].studyTimeToday || 0).toFixed(1)),
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
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy metrics',
            error: error.message
        });
    }
});

module.exports = router;
