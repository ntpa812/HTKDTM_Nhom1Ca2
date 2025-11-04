// --- 1. IMPORT CÁC MODULE CẦN THIẾT ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// --- 2. KHỞI TẠO ỨNG DỤNG EXPRESS ---
const app = express();

// --- 3. CẤU HÌNH MIDDLEWARE ---
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Cho phép cả 2 port phổ biến
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Xử lý dữ liệu JSON và URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ghi log các request ra console để debug (ở môi trường development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// --- 4. ĐĂNG KÝ CÁC API ROUTES ---
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/dashboard', require('./routes/dashboard'));
    app.use('/api/courses', require('./routes/courses'));
    app.use('/api/learning-paths', require('./routes/learningPaths'));
    app.use('/api/analytics', require('./routes/analytics'));
    // app.use('/api/users', require('./routes/users'));
    // app.use('/api/ai', require('./routes/ai'));

    console.log('✅ All API routes registered successfully.');

} catch (error) {
    console.error('❌ FATAL ERROR: Could not load routes. One of the route files may have a syntax error.', error);
    // Trong trường hợp một file route bị lỗi, server sẽ không khởi động để tránh các lỗi không mong muốn.
    process.exit(1);
}


// --- 5. CÁC ROUTE CƠ BẢN (ROOT & TEST) ---

// Route gốc để kiểm tra server có hoạt động không
app.get('/', (req, res) => {
    res.status(200).send('<h1>Smart LMS Backend API is running...</h1>');
});

// Route để kiểm tra kết nối CSDL
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = require('../config/db'); // lấy pool MySQL từ config/db.js
    const [rows] = await pool.query('SELECT NOW() AS currentTime');
    res.status(200).json({
      success: true,
      message: '✅ MySQL database connected successfully!',
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    res.status(500).json({
      success: false,
      message: '❌ Database connection failed.',
      error: error.message,
    });
  }
});



// --- 6. XỬ LÝ LỖI (ERROR HANDLING) ---

// Handler cho các route không tồn tại (404 Not Found)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Handler xử lý tất cả các lỗi khác (Global Error Handler)
app.use((err, req, res, next) => {
    console.error('❌ UNHANDLED ERROR:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'An unexpected internal server error occurred.',
        // Chỉ hiển thị stack trace ở môi trường development để bảo mật
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});


// --- 7. KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server is listening on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});


// --- 8. EXPORT APP (DÙNG CHO VIỆC TEST) ---
module.exports = app;

