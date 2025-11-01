const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const sql = require('mssql');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Cấu hình kết nối CSDL từ file .env
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10), // Đọc port từ .env
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true',
    },
};

// Hàm chính để seed dữ liệu
async function seedBehaviorData() {
    console.log('Bắt đầu quá trình seed dữ liệu hành vi...');

    try {
        // --- BƯỚC 1: Đọc và xác thực dữ liệu CSV ---
        const csvFilePath = path.resolve(__dirname, 'data', 'student_behavior_data.csv'); // Đảm bảo tên file CSV của bạn là đây
        const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        if (records.length === 0) {
            console.error('Lỗi: File CSV rỗng hoặc không đọc được.');
            return;
        }
        console.log(`✅ Đã đọc được ${records.length} bản ghi từ file CSV.`);

        // --- BƯỚC 2: Kết nối CSDL và lấy danh sách User ID ---
        await sql.connect(dbConfig);
        console.log('✅ Kết nối CSDL MSSQL thành công.');

        const userResult = await sql.query`SELECT ID FROM Users WHERE Role = 'student'`;
        const userIds = userResult.recordset.map(u => u.ID);

        if (userIds.length === 0) {
            console.error('Lỗi: Không tìm thấy user nào có vai trò "student". Vui lòng seed dữ liệu user trước.');
            await sql.close();
            return;
        }
        console.log(`✅ Đã tìm thấy ${userIds.length} student ID để gán dữ liệu.`);

        // --- BƯỚC 3: Chuẩn bị và thực hiện Bulk Insert ---
        const transaction = new sql.Transaction();
        await transaction.begin();
        console.log('Bắt đầu transaction...');

        try {
            console.log('Đang xóa dữ liệu cũ trong bảng StudentBehaviors...');
            await transaction.request().query('DELETE FROM StudentBehaviors');
            await transaction.request().query('DBCC CHECKIDENT (\'StudentBehaviors\', RESEED, 0)');

            const request = new sql.Request(transaction);
            const table = new sql.Table('StudentBehaviors');

            // Định nghĩa các cột cho bulk insert, đảm bảo khớp với CSDL
            table.columns.add('UserID', sql.Int);
            table.columns.add('StudyHours', sql.Float);
            table.columns.add('AssignmentCompletionRate', sql.Float);
            table.columns.add('QuizScore_Avg', sql.Float);
            table.columns.add('PlatformEngagement_Minutes', sql.Int);
            table.columns.add('LearningStyle', sql.NVarChar(50));
            table.columns.add('DeviceType', sql.NVarChar(50)); // Giả định bạn có cột này
            table.columns.add('SatisfactionLevel', sql.Int);    // Giả định bạn có cột này

            // Lặp qua các bản ghi và thêm vào bulk insert
            for (const record of records) {
                // *** ÁNH XẠ ĐÚNG TÊN CỘT TỪ CSV BẠN CUNG CẤP ***
                const studyHours = parseFloat(record.StudyHours) || 0;
                // File CSV của bạn không có "AssignmentCompletionRate", ta có thể lấy từ cột khác hoặc để mặc định
                const assignmentRate = parseFloat(record.AssignmentCompletion) || 0; // Giả sử dùng cột 'AssignmentCompletion'
                const quizScore = parseFloat(record.ExamScore) || 0; // Dùng 'ExamScore' cho QuizScore_Avg
                // File CSV không có "PlatformEngagement_Minutes", ta có thể dùng cột khác hoặc để giá trị ngẫu nhiên
                const engagement = (parseInt(record.Attendance) || 0) * 60; // Ví dụ: lấy số buổi học * 60 phút
                const learningStyle = record.LearningStyle || 'Unknown';
                // File CSV không có "DeviceType" và "SatisfactionLevel"
                const deviceType = 'Unknown';
                const satisfaction = parseInt(record.Motivation) || 3; // Ví dụ: lấy Motivation làm Satisfaction

                table.rows.add(
                    userIds[Math.floor(Math.random() * userIds.length)],
                    studyHours,
                    assignmentRate,
                    quizScore,
                    engagement,
                    learningStyle,
                    deviceType,
                    satisfaction
                );
            }

            // Thực hiện bulk insert
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
        await sql.close();
        console.log('Đã đóng kết nối CSDL.');
    }
}

// Chạy hàm seed
seedBehaviorData();