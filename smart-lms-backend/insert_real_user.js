const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: 'shuttle.proxy.rlwy.net',
    port: 15126,
    user: 'root',
    password: 'cENOhUcXoEjnZyushBOmIXPgsgTjCqBB',
    database: 'railway'
  });

  // Hash đúng mật khẩu
  const hashed = await bcrypt.hash('password123', 10);

  await conn.query(`
    INSERT INTO Users (username, email, password, full_name, role)
    VALUES ('student02', 'student02@test.com', '${hashed}', 'Student 02', 'student')
  `);

  console.log('✅ Inserted new user student02@test.com / password123');
  await conn.end();
}

run();
