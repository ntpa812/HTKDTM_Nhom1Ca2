// Lấy danh sách user
sql.query('SELECT * FROM users', (err, result) => {
    if (err) throw err;
    console.dir(result.recordset); // result.recordset là mảng object kết quả
});
