require('dotenv').config();
const { poolPromise } = require('./config/database');

(async () => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query('SELECT * FROM Courses');
    console.log('✅ Connected! Example data:');
    console.table(rows);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();

