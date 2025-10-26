// Compatibility shim: repository uses `src/utlis` (typo).
// Some modules require '../utils/mssql' — forward to the actual implementation.
module.exports = require('../utils/mssql');
