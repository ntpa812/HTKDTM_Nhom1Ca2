const sql = require('mssql');

const config = {
    user: 'sa', // hoặc user bạn dùng
    password: 'yourpassword',
    server: 'localhost', // hoặc IP server
    database: 'smart_lms',
    options: {
        encrypt: false, // cần thiết với bản cài local
        trustServerCertificate: true
    }
};

sql.connect(config, err => {
    if (err) console.error('Lỗi kết nối:', err);
    else console.log('Kết nối SQL Server thành công!');
});
