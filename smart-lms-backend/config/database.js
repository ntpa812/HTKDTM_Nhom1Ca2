// Configurable MSSQL connection
// Supports two modes:
// - Windows Trusted Auth using msnodesqlv8 (DB_DRIVER=msnodesqlv8 or DB_TRUSTED=true)
// - SQL Auth using default tedious driver (provide DB_USER and DB_PASSWORD)

require('dotenv').config();

// Choose driver based on env
const useMsNodeSql = (process.env.DB_DRIVER === 'msnodesqlv8') || (process.env.DB_TRUSTED === 'true');
const sql = useMsNodeSql ? require('mssql/msnodesqlv8') : require('mssql');

// Build config from environment with sensible defaults
const config = useMsNodeSql
    ? {
        server: process.env.DB_SERVER || 'localhost',
        database: process.env.DB_NAME || 'smart-lms',
        driver: 'msnodesqlv8',
        options: {
            trustedConnection: process.env.DB_TRUSTED !== 'false', // default true for msnodesqlv8 case
            enableArithAbort: true,
            trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true' || true,
            instanceName: process.env.DB_INSTANCE || undefined
        }
    }
    : {
        user: process.env.DB_USER || undefined,
        password: process.env.DB_PASSWORD || undefined,
        server: process.env.DB_SERVER || 'localhost',
        database: process.env.DB_NAME || 'smart-lms',
        options: {
            encrypt: process.env.DB_ENCRYPT === 'true',
            enableArithAbort: true,
            trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true' || true,
            instanceName: process.env.DB_INSTANCE || undefined
        }
    };

// Connect and export poolPromise for reuse (matches existing code patterns)
const poolPromise = sql.connect(config)
    .then(pool => {
        console.log(`✅ Connected to MSSQL (${useMsNodeSql ? 'msnodesqlv8 - Windows Auth' : 'tedious - SQL Auth'})`);
        return pool;
    })
    .catch(err => {
        console.error('❌ MSSQL Connection Failed:', err.message || err);
        throw err;
    });

module.exports = { sql, poolPromise, config };
