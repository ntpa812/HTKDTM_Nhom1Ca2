// File: smart-lms-backend/config/database.js (FINAL, CORRECTED VERSION FOR SQL AUTH)
const sql = require('mssql');
require('dotenv').config();

// Cấu hình kết nối chuẩn, sử dụng SQL Server Authentication từ file .env
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true, // Rất quan trọng khi làm việc trên local
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

console.log("🔄 Connecting to database with SQL Server Authentication...");
console.log("Server:", dbConfig.server);
console.log("Database:", dbConfig.database);
console.log("User:", dbConfig.user);

// Tạo một ConnectionPool
const pool = new sql.ConnectionPool(dbConfig);

// Hàm connect sẽ trả về một promise của pool đã kết nối
const poolPromise = pool.connect()
    .then(pool => {
        console.log('✅ Database connected successfully!');
        return pool;
    })
    .catch(err => {
        console.error('❌ Database Connection Failed! Bad Config:', err);
        console.error('\n🔍 Troubleshooting:');
        console.error('1. Is SQL Server running?');
        console.error('2. Is the server name, database, user, and password in your .env file correct?');
        console.error('3. Is TCP/IP enabled for your SQL Server instance?');
        process.exit(1);
    });

pool.on('error', err => {
    console.error('❌ SQL Pool Error:', err);
});

// Export poolPromise để các module khác có thể sử dụng
module.exports = {
    sql,
    poolPromise
};
