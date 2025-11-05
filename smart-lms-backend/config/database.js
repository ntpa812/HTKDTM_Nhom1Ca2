const mysql = require('mysql2/promise');

const connectionUrl = process.env.DATABASE_URL;

const poolPromise = mysql.createPool({
  uri: connectionUrl,
  ssl: {
    // ✅ Cho phép chứng chỉ tự ký để tránh lỗi HANDSHAKE_SSL_ERROR
    rejectUnauthorized: false
  }
});

module.exports = { poolPromise };
