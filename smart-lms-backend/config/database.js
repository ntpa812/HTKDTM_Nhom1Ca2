require('dotenv').config();
const sql = require('mssql/msnodesqlv8');

// Dùng ODBC Driver 17 (như ảnh bạn vừa gửi)
const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};Trusted_Connection=Yes;`;

console.log('🔄 Connecting to database...');
console.log(`Server: ${process.env.DB_SERVER}`);
console.log(`Database: ${process.env.DB_NAME}`);

const config = {
    connectionString: connectionString,
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        trustServerCertificate: true
    }
};

// Tạo connection pool
const poolPromise = sql.connect(config)
    .then(pool => {
        console.log('✅ Connected to MSSQL with Windows Authentication');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        console.log(`🖥️  Server: ${process.env.DB_SERVER}`);
        return pool;
    })
    .catch(err => {
        console.error('❌ MSSQL Connection Failed:', JSON.stringify(err, null, 2));
        console.error('\n🔍 Troubleshooting:');
        console.error('1. SQL Server (MSSQLSERVER02) is running?');
        console.error('2. Windows user has SQL Server access?');
        console.error('3. ODBC Driver 17 is installed? ✓ (You have it!)');
        throw err;
    });

module.exports = { sql, poolPromise };
