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

const getApplicationByCandidateId = async (candidateId) => {
    try {
        const query = `
            SELECT * FROM applications
            WHERE candidate_id = $1
            LIMIT 1;
        `;
        const values = [candidateId];
        const { rows } = await pool.query(query, values);
        return rows[0]; // Возвращаем первую запись
    } catch (error) {
        console.error('Error finding application by candidate_id:', error);
        throw error;
    }
};

module.exports = {
    getAllApplications,
    createApplication,
    getApplicationByCandidateId
};