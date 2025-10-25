// src/models/userModel.js
const mysql = require('../utils/mysql');
mysql.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    // Xử lý dữ liệu ở đây
});
