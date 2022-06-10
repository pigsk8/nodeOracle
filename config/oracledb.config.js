const oracledb = require('oracledb');
const config = require('.././config');

const configDB = {
    user: config.DB_USER,
    password: config.DB_USER_PASS,
    connectString: config.DB_URI
}

module.exports = {
    oracledb,
    configDB
}