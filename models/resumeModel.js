const pool = require('../config/db');

// Создать новое резюме
const createResume = async (resumeData) => {
    const { candidate_id, location, birth_date, citizenship } = resumeData;
    const query = `
        INSERT INTO resumes (candidate_id, location, birth_date, citizenship)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [candidate_id, location, birth_date, citizenship];
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Получить резюме по candidate_id
const getResumeByCandidateId = async (candidateId) => {
    const query = 'SELECT * FROM resumes WHERE candidate_id = $1';
    const values = [candidateId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Обновить резюме
const updateResume = async (resumeId, resumeData) => {
    const { location, birthDate, citizenship } = resumeData;
    const birth_date = birthDate;
    const query = `
        UPDATE resumes
        SET location = $1, birth_date = $2, citizenship = $3
        WHERE resume_id = $4
        RETURNING *;
    `;
    console.log('12345', resumeData);
    const values = [location, birth_date, citizenship, resumeId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

module.exports = {
    createResume,
    getResumeByCandidateId,
    updateResume,
};