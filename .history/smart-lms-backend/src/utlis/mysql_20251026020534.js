// src/utils/mysql.js
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Tên user của MySQL
    password: 'mypassword',// Mật khẩu MySQL
    database: 'smart_lms'  // Tên database
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Kết nối MySQL thành công!');
});

module.exports = connection;
