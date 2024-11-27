const pool = require('../config/db');

const getAllApplications = async () => {
    const res = await pool.query(`
        SELECT application_id, candidate_id, vacancy_id, status, applied_at
        FROM applications
    `);
    return res.rows;
};

module.exports = {
    getAllApplications
};