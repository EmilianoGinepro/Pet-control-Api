const sql = require('mssql');
const {DATABASE_HOST,DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME} = require('../config/config')

const db = new sql.ConnectionPool({
    server: DATABASE_HOST,
    port: parseInt(DATABASE_PORT),
    database: DATABASE_NAME,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,   
      }
})

module.exports = {db}
