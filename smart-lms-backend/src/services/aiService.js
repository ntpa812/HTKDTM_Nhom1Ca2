const { spawn } = require('child_process');
const path = require('path');
const sql = require('mssql');
const { poolPromise } = require('../../config/database');
/**
 * Lấy dự đoán AI cho một sinh viên.
 * @param {number} userId - ID của sinh viên.
 * @returns {Promise<object|null>} - Một object chứa kết quả dự đoán, hoặc null nếu có lỗi.
 */
// smart-lms-backend/src/services/aiService.js
async function getAIPrediction(userId) {
    try {
        // Query đúng tên cột trong database
        const result = await sql.query`
            SELECT TOP 1 
                StudyHours, 
                AssignmentCompletionRate, 
                QuizScore_Avg,
                PlatformEngagement_Minutes, 
                LearningStyle, 
                Motivation, 
                StressLevel,
                FinalGrade
            FROM dbo.StudentBehaviors 
            WHERE UserID = ${userId} 
            ORDER BY BehaviorID DESC`;

        if (result.recordset.length === 0) {
            console.warn(`AI Service: Không tìm thấy dữ liệu hành vi cho UserID ${userId}.`);
            return {
                status: 'no_data',
                message: 'Chưa có dữ liệu hành vi học tập',
                suggestion: 'Hãy tham gia một số khóa học để hệ thống có thể đưa ra dự đoán'
            };
        }

        const studentData = result.recordset[0];
        console.log(`📊 Data for UserID ${userId}:`, studentData);

        const dataString = JSON.stringify(studentData);
        const pythonScriptPath = path.join(__dirname, '..', '..', '..', 'smart-lms-ml', 'predict.py');

        return new Promise((resolve, reject) => {
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
                    console.error(`🔥 Python stderr cho UserID ${userId}:`, errorResult);
                }

                try {
                    const finalResult = JSON.parse(predictionResult);
                    if (finalResult.status === 'success') {
                        console.log(`✅ AI Prediction success cho UserID ${userId}:`, finalResult);
                        resolve(finalResult);
                    } else {
                        console.error(`❌ AI Model Error cho UserID ${userId}:`, finalResult);
                        if (finalResult.debug_info) {
                            console.error('🔍 Debug info:', finalResult.debug_info);
                        }
                        resolve({
                            status: 'model_error',
                            message: finalResult.message,
                            error_type: finalResult.error_type || 'unknown'
                        });
                    }
                } catch (parseError) {
                    console.error(`❌ Parse JSON error cho UserID ${userId}:`, parseError);
                    console.error(`📄 Raw Python output:`, predictionResult);
                    resolve({
                        status: 'parse_error',
                        message: 'Không thể parse kết quả từ AI model',
                        raw_output: predictionResult
                    });
                }
            });

            pythonProcess.on('error', (spawnError) => {
                console.error(`❌ Spawn error cho UserID ${userId}:`, spawnError);
                resolve({
                    status: 'spawn_error',
                    message: 'Không thể chạy Python script'
                });
            });
        });

    } catch (err) {
        console.error(`❌ Database error trong aiService cho UserID ${userId}:`, err.message);
        return {
            status: 'database_error',
            message: 'Lỗi truy vấn database'
        };
    }
}


module.exports = {
    getAIPrediction,
};
