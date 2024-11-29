const pool = require('../config/db');

const getAllApplications = async () => {
    const res = await pool.query(`
        SELECT application_id, candidate_id, vacancy_id, status, applied_at
        FROM applications
    `);
    return res.rows;
};

const createApplication = async (applicationData) => {
    const { candidate_id, vacancy_id, status } = applicationData;
    const query = `
        INSERT INTO applications (candidate_id, vacancy_id, status)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [candidate_id, vacancy_id, status || 'pending'];
    const res = await pool.query(query, values);
    return res.rows[0];
};

module.exports = {
    getAllApplications,
    createApplication
};