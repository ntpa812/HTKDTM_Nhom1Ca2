require('dotenv').config();
const sql = require('mssql/msnodesqlv8');

const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};Trusted_Connection=Yes;`;

console.log('Testing connection with:');
console.log('Server:', process.env.DB_SERVER);
console.log('Database:', process.env.DB_NAME);
console.log('Connection String:', connectionString);
console.log('');

sql.connect(connectionString)
    .then(pool => {
        console.log('✅ Connection successful!');
        return pool.request().query(`
      SELECT 
        SUSER_NAME() AS CurrentUser,
        DB_NAME() AS CurrentDatabase,
        @@SERVERNAME AS ServerName
    `);
    })
    .then(result => {
        console.log('\n📊 Connection Info:');
        console.log(result.recordset[0]);
        sql.close();
    })
    .catch(err => {
        console.error('❌ Connection failed!');
        console.error(err);

        if (err.message && err.message.includes('Login failed')) {
            console.error('\n💡 Solution: Run this in SSMS:');
            console.error(`CREATE LOGIN [${process.env.COMPUTERNAME}\\${process.env.USERNAME}] FROM WINDOWS;`);
            console.error(`USE ${process.env.DB_NAME};`);
            console.error(`CREATE USER [${process.env.COMPUTERNAME}\\${process.env.USERNAME}] FOR LOGIN [${process.env.COMPUTERNAME}\\${process.env.USERNAME}];`);
            console.error(`ALTER ROLE db_owner ADD MEMBER [${process.env.COMPUTERNAME}\\${process.env.USERNAME}];`);
        }
    });
