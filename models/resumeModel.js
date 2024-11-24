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

// Получение всех резюме
const getAllResumes = async () => {
    try {
        const query = `
            SELECT r.*, c.first_name, c.last_name, c.phone, c.education, c.experience
            FROM resumes r
            JOIN candidates c ON r.candidate_id = c.candidate_id
        `;
        const { rows } = await db.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching all resumes:', error);
        throw error;
    }
};

// Получение резюме по ID
const getResumeById = async (resumeId) => {
    try {
        const query = `
            SELECT r.*, c.first_name, c.last_name, c.phone, c.education, c.experience
            FROM resumes r
            JOIN candidates c ON r.candidate_id = c.candidate_id
            WHERE r.resume_id = $1
        `;
        const values = [resumeId];
        const { rows } = await db.query(query, values);
        return rows[0];
    } catch (error) {
        console.error('Error fetching resume by ID:', error);
        throw error;
    }
};

module.exports = {
    createResume,
    getResumeByCandidateId,
    updateResume,
    getAllResumes,
    getResumeById,
};