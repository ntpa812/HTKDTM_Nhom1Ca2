const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database');
const { authenticateToken } = require('../middleware/auth');

// --- CÁC ROUTE TĨNH (STATIC ROUTES) ---
// (Các route /my-paths, /categories, / không thay đổi, giữ nguyên như cũ)
router.get('/my-paths', authenticateToken, async (req, res) => { /*...*/ });
router.get('/categories', async (req, res) => { /*...*/ });

// --- ROUTE GỢI Ý (RECOMMENDATION) ---
// GET /api/learning-paths/recommendations
router.get('/recommendations', authenticateToken, async (req, res) => {
    console.log(`[${new Date().toISOString()}] --- Bắt đầu xử lý request GET /api/learning-paths/recommendations ---`);
    let pool;
    try {
        const { id: userId } = req.user;
        pool = await poolPromise; // Lấy connection pool một lần duy nhất

        // BƯỚC 1: Lấy thông tin của người dùng hiện tại một cách riêng biệt

        console.log(`[${new Date().toISOString()}] Bước 1: Đang lấy thông tin user ID: ${userId}`);
        const userRequest = pool.request().input('user_id_param', sql.Int, userId);
        const userResult = await userRequest.query('SELECT skill_level, career_goal FROM dbo.Users WHERE id = @user_id_param OPTION (RECOMPILE)');

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        }
        const currentUser = userResult.recordset[0];
        console.log(`[${new Date().toISOString()}] ✅ Lấy thông tin user thành công. Goal: ${currentUser.career_goal}`);

        // BƯỚC 2: Lấy danh sách các lộ trình ứng viên một cách riêng biệt
        console.log(`[${new Date().toISOString()}] Bước 2: Đang lấy danh sách các lộ trình ứng viên...`);
        const pathsRequest = pool.request().input('user_id_param', sql.Int, userId);
        const candidatePathsResult = await pathsRequest.query(`
            SELECT lp.id, lp.title, lp.description, lp.category, lp.difficulty
            FROM dbo.LearningPaths lp
            LEFT JOIN dbo.PathEnrollments pe ON lp.id = pe.path_id AND pe.user_id = @user_id_param
            WHERE lp.is_published = 1 AND pe.id IS NULL
            OPTION (RECOMPILE);
        `);
        const candidatePaths = candidatePathsResult.recordset;
        console.log(`[${new Date().toISOString()}] ✅ Tìm thấy ${candidatePaths.length} lộ trình ứng viên.`);

        // BƯỚC 3: Tính toán điểm (logic này không đổi và an toàn)
        const recommendations = candidatePaths.map(path => {
            let score = 0;
            let reasons = [];
            if (currentUser.career_goal && path.category && path.category.toLowerCase().includes(currentUser.career_goal.toLowerCase())) {
                score += 50;
                reasons.push(`Phù hợp với mục tiêu '${currentUser.career_goal}' của bạn`);
            }
            if (currentUser.skill_level && path.difficulty) {
                const difficultyMap = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
                if (difficultyMap[currentUser.skill_level] === difficultyMap[path.difficulty]) {
                    score += 40;
                    reasons.push(`Có độ khó '${path.difficulty}' hợp với trình độ của bạn`);
                }
            }
            if (score === 0) {
                reasons.push('Khám phá một lĩnh vực mới');
                score += 10;
            }
            return { ...path, matchPercentage: Math.min(score, 100), reasoning: reasons.join('. ') || 'Một gợi ý thú vị dành cho bạn.' };
        });

        // BƯỚC 4: Trả về kết quả
        const topRecommendations = recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);
        console.log(`[${new Date().toISOString()}] ✅ Gợi ý thành công, trả về ${topRecommendations.length} learning paths.`);
        res.json({ success: true, data: topRecommendations });

    } catch (error) {
        console.error('❌ Lỗi khi tạo gợi ý learning paths:', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Lỗi server khi tạo gợi ý.', error: error.message });
    }
});



router.get('/', authenticateToken, async (req, res) => {
    console.log(`[${new Date().toISOString()}] --- Bắt đầu xử lý request GET /api/learning-paths ---`);
    try {
        const { id: userId } = req.user; // Lấy userId từ token đã xác thực
        const pool = await poolPromise;
        console.log(`[${new Date().toISOString()}] ✅ Lấy connection pool thành công!`);

        const result = await pool.request()
            .input('user_id', sql.Int, userId)
            .query(`
                SELECT
                    lp.id,
                    lp.title,
                    lp.description,
                    lp.category,
                    lp.difficulty,
                    lp.estimated_hours,
                    u.full_name as instructor_name,
                    lp.created_at,
                    (SELECT COUNT(*) FROM dbo.PathCourses pc WHERE pc.path_id = lp.id) as courses_count,
                    
                    -- Sửa lỗi: Dùng đúng bảng và bí danh
                    (SELECT COUNT(*) FROM dbo.PathEnrollments pe WHERE pe.path_id = lp.id) as enrollment_count,
                    
                    -- Sửa lỗi: Dùng CASE WHEN EXISTS để kiểm tra enrollment, cú pháp này an toàn hơn
                    CASE WHEN EXISTS(SELECT 1 FROM dbo.PathEnrollments pe WHERE pe.path_id = lp.id AND pe.user_id = @user_id)
                        THEN 1
                        ELSE 0
                    END as is_enrolled,

                    (SELECT AVG(CAST(pp.progress AS FLOAT)) FROM dbo.PathProgress pp WHERE pp.path_id = lp.id AND pp.user_id = @user_id) as user_progress
                FROM
                    dbo.LearningPaths lp
                JOIN
                    dbo.Users u ON lp.owner_id = u.id
                WHERE
                    lp.is_published = 1
                ORDER BY
                    lp.created_at DESC;
            `);

        console.log(`[${new Date().toISOString()}] ✅ Truy vấn database thành công, trả về ${result.recordset.length} learning paths.`);

        // Trả về dữ liệu cho frontend
        res.json({
            success: true,
            data: {
                paths: result.recordset
            }
        });

    } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách learning paths:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách learning paths.', error: error.message });
    }
});


// --- ROUTE ĐỘNG (DYNAMIC ROUTE) - ĐÃ ĐƯỢC NÂNG CẤP ---
// GET /api/learning-paths/:id - Lấy chi tiết một learning path, bao gồm trạng thái khóa học cho user
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id: pathId } = req.params;
        const { id: userId } = req.user; // Lấy userId từ token đã xác thực
        const pool = await poolPromise;

        // 1. Lấy thông tin chính của learning path
        const pathResult = await pool.request()
            .input('id', sql.Int, pathId)
            .query(`
                SELECT lp.id, lp.title, lp.description, lp.category, lp.difficulty, lp.estimated_hours,
                       u.full_name as instructor_name
                FROM LearningPaths lp JOIN Users u ON lp.owner_id = u.id
                WHERE lp.id = @id AND lp.is_published = 1;
            `);

        if (pathResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy Learning Path.' });
        }
        const learningPath = pathResult.recordset[0];

        // 2. Lấy TOÀN BỘ khóa học trong path, sắp xếp theo thứ tự
        const allCoursesResult = await pool.request()
            .input('path_id', sql.Int, pathId)
            .query('SELECT c.id, c.title, c.description, pc.position FROM PathCourses pc JOIN Courses c ON pc.course_id = c.id WHERE pc.path_id = @path_id ORDER BY pc.position ASC;');
        const allCourses = allCoursesResult.recordset;

        // 3. Lấy TIẾN ĐỘ của user trong path này
        const progressResult = await pool.request()
            .input('path_id', sql.Int, pathId)
            .input('user_id', sql.Int, userId)
            .query('SELECT course_id, completed, progress FROM PathProgress WHERE path_id = @path_id AND user_id = @user_id;');

        // Tạo một map để tra cứu tiến độ nhanh hơn
        const progressMap = new Map(progressResult.recordset.map(p => [p.course_id, p]));

        // 4. Tính toán trạng thái (isLocked, completionStatus) cho từng khóa học
        let previousCourseCompleted = true; // Khóa đầu tiên luôn được mở
        learningPath.courses = allCourses.map(course => {
            const userProgress = progressMap.get(course.id);
            let status = 'locked';
            const isLocked = !previousCourseCompleted;

            if (!isLocked) {
                if (userProgress?.completed) {
                    status = 'completed';
                } else if (userProgress && userProgress.progress > 0) {
                    status = 'in_progress';
                } else {
                    status = 'not_started';
                }
            }

            // Cập nhật điều kiện để mở khóa học tiếp theo
            previousCourseCompleted = (status === 'completed');

            return {
                ...course,
                isLocked,
                status, // 'locked', 'not_started', 'in_progress', 'completed'
                progress: userProgress?.progress || 0
            };
        });

        res.json({ success: true, data: learningPath });

    } catch (error) {
        console.error('❌ Lỗi khi lấy chi tiết learning path:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu chi tiết.', error: error.message });
    }
});

// GET /api/learning-paths/:pathId/my-progress - Lấy thông tin tiến độ tổng quan của user cho một path
router.get('/:pathId/my-progress', authenticateToken, async (req, res) => {
    const { pathId } = req.params;
    const { id: userId } = req.user; // Lấy userId từ token

    try {
        const pool = await poolPromise;

        // Query 1: Đếm tổng số khóa học trong lộ trình
        const totalCoursesResult = await pool.request()
            .input('path_id', sql.Int, pathId)
            .query('SELECT COUNT(*) as totalCourses FROM PathCourses WHERE path_id = @path_id');

        const totalCourses = totalCoursesResult.recordset[0]?.totalCourses || 0;

        if (totalCourses === 0) {
            // Nếu lộ trình chưa có khóa học, trả về giá trị 0
            return res.json({
                success: true,
                data: { overallCompletion: 0, coursesCompleted: 0, totalCourses: 0, totalTimeSpent: 0 }
            });
        }

        // Query 2: Lấy và tính toán tiến độ của user từ bảng PathProgress
        const userProgressResult = await pool.request()
            .input('path_id', sql.Int, pathId)
            .input('user_id', sql.Int, userId)
            .query(`
                SELECT
                    COUNT(CASE WHEN completed = 1 THEN 1 END) as coursesCompleted,
                    SUM(time_spent_minutes) as totalTimeSpent
                FROM PathProgress
                WHERE path_id = @path_id AND user_id = @user_id;
            `);

        const progressData = userProgressResult.recordset[0];
        const coursesCompleted = parseInt(progressData.coursesCompleted) || 0;
        const totalTimeSpent = parseInt(progressData.totalTimeSpent) || 0;

        // Tính toán phần trăm hoàn thành tổng thể
        const overallCompletion = totalCourses > 0 ? (coursesCompleted / totalCourses) * 100 : 0;

        const responseData = {
            overallCompletion: Math.round(overallCompletion),
            coursesCompleted,
            totalCourses,
            totalTimeSpent // Đơn vị: phút
        };

        res.json({ success: true, data: responseData });

    } catch (error) {
        console.error('❌ Lỗi khi lấy tiến độ learning path:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu tiến độ.', error: error.message });
    }
});



module.exports = router;
