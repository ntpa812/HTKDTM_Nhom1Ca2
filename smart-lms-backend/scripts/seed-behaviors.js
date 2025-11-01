const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const sql = require('mssql');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Cấu hình kết nối CSDL
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true',
    },
};

// Hàm chính để seed dữ liệu
async function seedBehaviorData() {
    console.log('Bắt đầu quá trình seed dữ liệu hành vi...');

    try {
        const csvFilePath = path.resolve(__dirname, 'data', 'student_behavior_data.csv');
        const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
        const records = parse(fileContent, { columns: true, skip_empty_lines: true, trim: true });
        console.log(`✅ Đã đọc được ${records.length} bản ghi từ file CSV.`);

        await sql.connect(dbConfig);
        console.log('✅ Kết nối CSDL MSSQL thành công.');

        const userResult = await sql.query`SELECT ID FROM Users WHERE Role = 'student'`;
        const userIds = userResult.recordset.map(u => u.ID);
        if (userIds.length === 0) {
            console.error('Lỗi: Không tìm thấy user nào có vai trò "student".');
            return;
        }
        console.log(`✅ Đã tìm thấy ${userIds.length} student ID để gán dữ liệu.`);

        const transaction = new sql.Transaction();
        await transaction.begin();
        console.log('Bắt đầu transaction...');

        try {
            console.log('Đang xóa dữ liệu cũ trong bảng StudentBehaviors...');
            await transaction.request().query('DELETE FROM StudentBehaviors');
            await transaction.request().query('DBCC CHECKIDENT (\'StudentBehaviors\', RESEED, 0)');

            const request = new sql.Request(transaction);
            const table = new sql.Table('StudentBehaviors');

            // *** THÊM CÁC CỘT MỚI VÀO ĐỊNH NGHĨA BẢNG ***
            table.columns.add('UserID', sql.Int);
            table.columns.add('StudyHours', sql.Float);
            table.columns.add('AssignmentCompletionRate', sql.Float);
            table.columns.add('QuizScore_Avg', sql.Float);
            table.columns.add('PlatformEngagement_Minutes', sql.Int);
            table.columns.add('LearningStyle', sql.NVarChar(50));
            table.columns.add('Motivation', sql.Int);      // Cột mới
            table.columns.add('StressLevel', sql.Int);      // Cột mới
            table.columns.add('FinalGrade', sql.Float);    // Cột mới

            for (const record of records) {
                const studyHours = parseFloat(record.StudyHours) || 0;
                const assignmentRate = parseFloat(record.AssignmentCompletion) || 0;
                const quizScore = parseFloat(record.ExamScore) || 0;
                const engagement = (parseInt(record.Attendance) || 0) * 60;
                const learningStyle = record.LearningStyle || 'Unknown';
                // *** LẤY DỮ LIỆU CHO CÁC CỘT MỚI TỪ CSV ***
                const motivation = parseInt(record.Motivation) || 3;
                const stressLevel = parseInt(record.StressLevel) || 0;
                const finalGrade = parseFloat(record.FinalGrade) || 0;

                table.rows.add(
                    userIds[Math.floor(Math.random() * userIds.length)],
                    studyHours,
                    assignmentRate,
                    quizScore,
                    engagement,
                    learningStyle,
                    motivation,
                    stressLevel,
                    finalGrade
                );
            }

            await request.bulk(table);
            await transaction.commit();
            console.log('✅✅✅ Seed dữ liệu hành vi thành công!');

        } catch (err) {
            await transaction.rollback();
            console.error('Lỗi trong quá trình transaction, đã rollback:', err);
        }

    } catch (err) {
        console.error('Lỗi nghiêm trọng khi seed dữ liệu:', err);
    } finally {
        if (sql.pool) {
            await sql.close();
            console.log('Đã đóng kết nối CSDL.');
        }
    }
}

seedBehaviorData();

