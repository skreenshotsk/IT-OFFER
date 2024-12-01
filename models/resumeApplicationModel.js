const pool = require('../config/db');

const getAllResumeApplications = async () => {
    const res = await pool.query(`
        SELECT application_id, employer_id, resume_id, status, applied_at
        FROM resume_applications
    `);
    return res.rows;
};

const createResumeApplication = async (applicationData) => {
    const { employer_id, resume_id, status } = applicationData;
    const query = `
        INSERT INTO resume_applications (employer_id, resume_id, status)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [employer_id, resume_id, status || 'pending'];
    const res = await pool.query(query, values);
    return res.rows[0];
};

/*const getResumeIdByEmployerId = async (employerId) => {
    const query = 'SELECT resume_id FROM resume_applications WHERE employer_id = $1';
    const values = [employerId];
    const res = await pool.query(query, values);
    return res.rows.length > 0 ? res.rows[0].resume_id : null;
};*/

const getResumeIdByEmployerId = async (employerId) => {
    const query = 'SELECT resume_id FROM resume_applications WHERE employer_id = $1';
    const values = [employerId];
    const res = await pool.query(query, values);
    // Extract resume_ids into an array
    const resumeIds = res.rows.map(row => row.resume_id);
    return resumeIds;
};

module.exports = {
    getAllResumeApplications,
    createResumeApplication,
    getResumeIdByEmployerId
};