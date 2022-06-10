require("dotenv").config();

module.exports = {
    SERVER_PORT: process.env.SERVER_PORT || 3000,
    CONTEXT_PATH: process.env.CONTEXT_PATH || '/api-test',
    TZ: process.env.TZ || 'America/Mexico_City',
    DB_USER: process.env.DB_USER,
    DB_USER_PASS: process.env.DB_USER_PASS,
    DB_SCHEMA: process.env.DB_SCHEMA,
    DB_URI: process.env.DB_URI
}