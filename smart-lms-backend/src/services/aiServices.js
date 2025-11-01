const { spawn } = require('child_process');
const path = require('path');
const sql = require('mssql');

/**
 * Lấy dự đoán AI cho một sinh viên.
 * @param {number} userId - ID của sinh viên.
 * @returns {Promise<object|null>} - Một object chứa kết quả dự đoán, hoặc null nếu có lỗi.
 */
async function getAIPrediction(userId) {
    try {
        // 1. Lấy dữ liệu hành vi mới nhất của sinh viên
        const result = await sql.query`
            SELECT TOP 1 
                StudyHours, AssignmentCompletionRate, QuizScore_Avg,
                PlatformEngagement_Minutes, LearningStyle, Motivation, StressLevel 
            FROM StudentBehaviors 
            WHERE UserID = ${userId} 
            ORDER BY BehaviorID DESC`;

        if (result.recordset.length === 0) {
            console.warn(`AI Service: Không tìm thấy dữ liệu hành vi cho UserID ${userId}.`);
            return null; // Trả về null nếu không có dữ liệu
        }

        const studentData = result.recordset[0];
        const dataString = JSON.stringify(studentData);
        const pythonScriptPath = path.join(__dirname, '..', '..', '..', 'smart-lms-ml', 'predict.py');

        // 2. Gọi script Python và trả về một Promise
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
                    console.error(`Lỗi từ script predict.py cho UserID ${userId}: ${errorResult}`);
                    return resolve(null); // Trả về null nếu có lỗi từ script
                }

                try {
                    const finalResult = JSON.parse(predictionResult);
                    if (finalResult.status === 'success') {
                        resolve(finalResult); // Promise thành công, trả về kết quả
                    } else {
                        console.error(`Mô hình AI trả về lỗi cho UserID ${userId}:`, finalResult.message);
                        resolve(null);
                    }
                } catch (parseError) {
                    console.error(`Lỗi parse JSON từ script AI cho UserID ${userId}:`, parseError);
                    resolve(null);
                }
            });
        });

    } catch (err) {
        console.error(`Lỗi nghiêm trọng trong aiService cho UserID ${userId}:`, err.message);
        return null; // Trả về null nếu có lỗi CSDL
    }
}

module.exports = {
    getAIPrediction,
};
