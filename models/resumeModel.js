const pool = require('../config/db');

// Создать новое резюме
const createResume = async (resumeData) => {
    const { candidate_id, location, birth_date, citizenship, profession, salary_max } = resumeData;
    const query = `
        INSERT INTO resumes (candidate_id, location, birth_date, citizenship, profession, salary_max)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [candidate_id, location, birth_date, citizenship, profession, salary_max];
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
    const { location, birthDate, citizenship, profession, salary_max } = resumeData;
    const birth_date = birthDate;
    const query = `
        UPDATE resumes
        SET location = $1, birth_date = $2, citizenship = $3, resumes.profession = $5, resumes.salary_max = $6,
        WHERE resume_id = $4
        RETURNING *;
    `;
    console.log('12345', resumeData);
    const values = [location, birth_date, citizenship, profession, salary_max, resumeId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

const getAllResumes = async () => {
    try {
        const query = `
            SELECT resumes.resume_id, resumes.location, resumes.birth_date, resumes.citizenship, resumes.profession, resumes.salary_max, resumes.created_at,
                   users.first_name, users.last_name, users.email, candidates.phone, candidates.education, candidates.experience, candidates.telegram_id
            FROM resumes
            JOIN candidates ON resumes.candidate_id = candidates.candidate_id
            JOIN users ON candidates.user_id = users.user_id
        `;
        const { rows } = await pool.query(query);
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
            SELECT resumes.resume_id, resumes.location, resumes.birth_date, resumes.citizenship, resumes.profession, resumes.salary_max, resumes.created_at,
                   users.first_name, users.last_name, users.email, candidates.phone, candidates.education, candidates.experience, candidates.telegram_id
            FROM resumes
            JOIN candidates ON resumes.candidate_id = candidates.candidate_id
            JOIN users ON candidates.user_id = users.user_id
            WHERE resumes.resume_id = $1
        `;
        const values = [resumeId];
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error('Error fetching resume by ID:', error);
        throw error;
    }
};

const getAllResumesAdmin = async () => {
    const res = await pool.query(`
        SELECT resume_id, candidate_id, location, birth_date, citizenship, profession, salary_max, created_at
        FROM resumes
    `);
    return res.rows;
};

const getAllResumesByUserId = async (user_id) => {
    try {
        const query = `
            SELECT r.*, c.first_name, c.last_name
            FROM resumes r
            JOIN candidates c ON r.candidate_id = c.candidate_id
            WHERE c.user_id = $1;
        `;
        const { rows } = await pool.query(query, [user_id]);
        return rows;
    } catch (error) {
        console.error('Error fetching all resumes:', error);
        throw error;
    }
};

const deleteResume = async (resumeId) => {
    const query = 'DELETE FROM resumes WHERE resume_id = $1 RETURNING *';
    const values = [resumeId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

module.exports = {
    createResume,
    getResumeByCandidateId,
    updateResume,
    getAllResumes,
    getResumeById,
    getAllResumesAdmin,
    getAllResumesByUserId,
    deleteResume,
};