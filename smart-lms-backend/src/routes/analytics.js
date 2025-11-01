// smart-lms-backend/src/routes/analytics.js

const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../../config/database');
const { authenticateToken } = require('../middleware/auth');

// Middleware authorizeAdmin đã được xóa khỏi đây

// GET /api/analytics/paths-overview
// Endpoint này bây giờ có thể được truy cập bởi bất kỳ ai đã đăng nhập
router.get('/paths-overview', authenticateToken, async (req, res) => {
    console.log(`[${new Date().toISOString()}] --- Bắt đầu xử lý request GET /api/analytics/paths-overview ---`);
    try {
        const { id: userId } = req.user; // Lấy userId từ token
        const pool = await poolPromise;
        const request = pool.request();
        request.input('user_id_param', sql.Int, userId); // Thêm userId làm tham số cho query

        const query = `
            WITH PathEnrollments AS (
                SELECT
                    path_id,
                    COUNT(*) AS total_enrollments,
                    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS total_completions
                FROM dbo.PathEnrollments
                GROUP BY path_id
            ),
            PathDurations AS (
                SELECT
                    path_id,
                    AVG(CAST(DATEDIFF(day, enrolled_at, completed_at) AS FLOAT)) AS avg_completion_days
                FROM dbo.PathEnrollments
                WHERE status = 'completed' AND completed_at IS NOT NULL
                GROUP BY path_id
            ),
            DropoutPoints AS (
                SELECT
                    path_id,
                    course_id,
                    ROW_NUMBER() OVER(PARTITION BY path_id ORDER BY drop_count DESC) as rn
                FROM (
                    SELECT 
                        pp.path_id, 
                        pp.course_id, 
                        COUNT(*) as drop_count
                    FROM dbo.PathProgress pp
                    JOIN dbo.PathCourses pc ON pp.path_id = pc.path_id AND pp.course_id = pc.course_id
                    WHERE pp.progress < 100 AND pp.completed = 0 AND pp.last_updated < DATEADD(day, -30, GETDATE()) 
                    GROUP BY pp.path_id, pp.course_id
                ) AS SubQuery
            )
            SELECT
                lp.id, lp.title, lp.difficulty, u.full_name AS instructor_name,
                ISNULL(pe.total_enrollments, 0) AS total_enrollments,
                ISNULL(pe.total_completions, 0) AS total_completions,
                CASE
                    WHEN ISNULL(pe.total_enrollments, 0) > 0 THEN (CAST(ISNULL(pe.total_completions, 0) AS FLOAT) / pe.total_enrollments) * 100
                    ELSE 0
                END AS completion_rate,
                ISNULL(pd.avg_completion_days, 0) AS avg_completion_days,
                (SELECT c.title FROM dbo.Courses c WHERE c.id = dp.course_id) AS top_dropout_course
            FROM
                dbo.LearningPaths lp
            /* === THAY ĐỔI CHÍNH: DÙNG INNER JOIN ĐỂ LỌC === */
            INNER JOIN
                dbo.PathEnrollments pe_user_filter ON lp.id = pe_user_filter.path_id AND pe_user_filter.user_id = @user_id_param
            /* ============================================== */
            LEFT JOIN PathEnrollments pe ON lp.id = pe.path_id
            LEFT JOIN PathDurations pd ON lp.id = pd.path_id
            LEFT JOIN Users u ON lp.owner_id = u.id
            LEFT JOIN (SELECT * FROM DropoutPoints WHERE rn = 1) dp ON lp.id = dp.path_id
            WHERE
                lp.is_published = 1
            ORDER BY
                total_enrollments DESC;
        `;

        const result = await request.query(query);

        console.log(`[${new Date().toISOString()}] ✅ Lấy dữ liệu analytics thành công, trả về ${result.recordset.length} learning paths đã đăng ký.`);
        res.json({ success: true, data: result.recordset });

    } catch (error) {
        console.error('❌ Lỗi khi lấy dữ liệu analytics:', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu analytics.', error: error.message });
    }
});


// GET /api/analytics/timeseries?period=30
// Endpoint để lấy dữ liệu chuỗi thời gian cho biểu đồ
router.get('/timeseries', authenticateToken, async (req, res) => {
    // Lấy số ngày từ query param, mặc định là 30 ngày
    const periodInDays = parseInt(req.query.period) || 30;
    console.log(`[${new Date().toISOString()}] --- Bắt đầu xử lý request GET /api/analytics/timeseries cho ${periodInDays} ngày ---`);

    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            -- 1. Tạo một bảng tạm (CTE) chứa chuỗi ngày trong khoảng thời gian yêu cầu
            WITH DateSeries AS (
                SELECT CAST(DATEADD(day, -@period, GETDATE()) AS DATE) AS day_date
                UNION ALL
                SELECT DATEADD(day, 1, day_date)
                FROM DateSeries
                WHERE day_date < CAST(GETDATE() AS DATE)
            ),

            -- 2. Đếm số lượt đăng ký mới theo ngày
            DailyEnrollments AS (
                SELECT
                    CAST(enrolled_at AS DATE) AS enrollment_date,
                    COUNT(*) AS new_enrollments
                FROM dbo.PathEnrollments
                GROUP BY CAST(enrolled_at AS DATE)
            ),

            -- 3. Đếm số lượt hoàn thành mới theo ngày
            DailyCompletions AS (
                SELECT
                    CAST(completed_at AS DATE) AS completion_date,
                    COUNT(*) AS new_completions
                FROM dbo.PathEnrollments
                WHERE status = 'completed' AND completed_at IS NOT NULL
                GROUP BY CAST(completed_at AS DATE)
            )

            -- 4. Kết hợp tất cả lại, dùng LEFT JOIN từ chuỗi ngày để đảm bảo không ngày nào bị thiếu
            SELECT
                FORMAT(ds.day_date, 'yyyy-MM-dd') AS date,
                ISNULL(de.new_enrollments, 0) AS new_enrollments,
                ISNULL(dc.new_completions, 0) AS new_completions
            FROM
                DateSeries ds
            LEFT JOIN
                DailyEnrollments de ON ds.day_date = de.enrollment_date
            LEFT JOIN
                DailyCompletions dc ON ds.day_date = dc.completion_date
            ORDER BY
                ds.day_date ASC
            -- Cần thiết cho các phiên bản SQL Server cũ hơn
            OPTION (MAXRECURSION 365);
        `;

        request.input('period', sql.Int, periodInDays);
        const result = await request.query(query);

        console.log(`[${new Date().toISOString()}] ✅ Lấy dữ liệu timeseries thành công, trả về ${result.recordset.length} ngày.`);
        res.json({ success: true, data: result.recordset });

    } catch (error) {
        console.error('❌ Lỗi khi lấy dữ liệu timeseries:', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu chuỗi thời gian.', error: error.message });
    }
});

module.exports = router;
