// smart-lms-backend/src/utils/mssql.js
const sql = require('mssql');

const config = {
    user: 'SA', // hoặc user bạn dùng
    password: 'your_password',
    server: 'localhost', // hoặc server bạn dùng
    database: 'smart_lms',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Kết nối MSSQL thành công');
        return pool;
    })
    .catch(err => console.log('Kết nối MSSQL thất bại', err));

module.exports = { sql, poolPromise };
