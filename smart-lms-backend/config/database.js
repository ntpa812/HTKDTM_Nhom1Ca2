const mysql = require('mysql2/promise');

// ✅ Lấy URL từ biến môi trường trên Railway
const connectionUrl = process.env.DATABASE_URL;

// ✅ Khởi tạo connection pool có SSL để Railway cho phép kết nối
const poolPromise = mysql.createPool(connectionUrl + '?ssl={"rejectUnauthorized":true}');

module.exports = { poolPromise };
