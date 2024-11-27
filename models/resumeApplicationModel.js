const pool = require('../config/db');

const getAllResumeApplications = async () => {
    const res = await pool.query(`
        SELECT application_id, employer_id, resume_id, status, applied_at
        FROM resume_applications
    `);
    return res.rows;
};

module.exports = {
    getAllResumeApplications
};