const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'it-offer',
    password: 'postgres',
    port: 5434,
});

module.exports = pool;
