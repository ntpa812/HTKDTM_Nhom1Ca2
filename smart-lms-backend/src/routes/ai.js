const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const sql = require('mssql');
const path = require('path');

// Sửa lại đường dẫn require cho chính xác
const authMiddleware = require('../middleware/auth');

// @route   GET /api/ai/predict/:userId
// @desc    Dự đoán kết quả học tập cho một sinh viên.
router.get('/predict/:userId', authMiddleware, async (req, res) => {
  try {
    const requestedUserId = parseInt(req.params.userId, 10);
    const loggedInUserId = req.user.id;
    const loggedInUserRole = req.user.role;

    // Kiểm tra quyền truy cập
    if (loggedInUserRole === 'student' && loggedInUserId !== requestedUserId) {
      return res.status(403).json({ msg: 'Forbidden: Bạn không có quyền xem dự đoán của người khác.' });
    }

    // Lấy dữ liệu hành vi
    const result = await sql.query`
            SELECT TOP 1 
                StudyHours, AssignmentCompletionRate, QuizScore_Avg, 
                PlatformEngagement_Minutes, LearningStyle, Motivation, StressLevel 
            FROM StudentBehaviors 
            WHERE UserID = ${requestedUserId} 
            ORDER BY BehaviorID DESC`;

    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: 'Không tìm thấy dữ liệu hành vi cho sinh viên này.' });
    }

    const studentData = result.recordset[0];

    // Gọi script Python
    const pythonScriptPath = path.join(__dirname, '..', '..', '..', 'smart-lms-ml', 'predict.py');
    const dataString = JSON.stringify(studentData);

    const pythonProcess = spawn('python', [pythonScriptPath, dataString]);

    let predictionResult = '';
    let errorResult = '';

    pythonProcess.stdout.on('data', (data) => {
      predictionResult += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorResult += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (errorResult) {
        console.error(`Lỗi từ script Python: ${errorResult}`);
        return res.status(500).json({ msg: 'Lỗi khi thực thi mô hình AI.', error: errorResult });
      }

      try {
        const finalResult = JSON.parse(predictionResult);
        if (finalResult.status === 'error') {
          return res.status(500).json({ msg: 'Mô hình AI trả về lỗi.', error: finalResult.message });
        }
        res.json(finalResult);
      } catch (parseError) {
        console.error('Lỗi khi parse kết quả JSON:', parseError);
        res.status(500).json({ msg: 'Không thể phân tích kết quả từ mô hình AI.' });
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
