const pool = require('../config/db');

// Получить резюме по candidate_id
const getResumeByCandidateId = async (candidateId) => {
    const query = 'SELECT * FROM resumes WHERE candidate_id = $1';
    const values = [candidateId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Обновить резюме
const updateResume = async (resumeId, resumeData) => {
    const { location, birth_date, citizenship } = resumeData;
    const query = `
        UPDATE resumes
        SET location = $1, birth_date = $2, citizenship = $3
        WHERE resume_id = $4
        RETURNING *;
    `;
    const values = [location, birth_date, citizenship, resumeId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

module.exports = {
    getResumeByCandidateId,
    updateResume,
};