const pool = require('../config/db');

// Создать кандидата
const createCandidate = async (candidate) => {
    const { user_id, phone, telegram_id, education, experience, portfolio_links, project_description_candidate } = candidate;
    const query = `
        INSERT INTO candidates (user_id, phone, telegram_id, education, experience, portfolio_links, project_description_candidate)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const values = [user_id, phone, telegram_id, education, experience, portfolio_links, project_description_candidate];
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Обновить кандидата
const updateCandidate = async (userId, candidate) => {
    const { phone, telegram_id, education, experience, portfolio_links, project_description_candidate } = candidate;
    const query = `
        UPDATE candidates
        SET phone = $1, telegram_id = $2, education = $3, experience = $4, portfolio_links = $5, project_description_candidate = $6
        WHERE user_id = $7
        RETURNING *;
    `;
    const values = [phone, telegram_id, education, experience, portfolio_links, project_description_candidate, userId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

const getCandidateByUserId = async (userId) => {
    const query = 'SELECT * FROM candidates WHERE user_id = $1';
    const values = [userId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

const getUserIdByCandidateId = async (candidateId) => {
    const query = 'SELECT user_id FROM candidates WHERE candidate_id = $1';
    const values = [candidateId];
    const res = await pool.query(query, values);
    return res.rows.length > 0 ? res.rows[0].user_id : null;
};

const updateCandidatePhone = async (candidateId, candidateData) => {
    const { phone } = candidateData;
    const query = `
        UPDATE candidates
        SET phone = $1
        WHERE candidate_id = $2
        RETURNING *;
    `;
    const values = [phone, candidateId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

const getAllCandidates = async () => {
    const res = await pool.query('SELECT * FROM candidates');
    return res.rows;
};

const deleteCandidate = async (candidateId) => {
    const query = 'DELETE FROM candidates WHERE candidate_id = $1 RETURNING *';
    const values = [candidateId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

module.exports = {
    createCandidate,
    updateCandidate,
    getCandidateByUserId,
    updateCandidatePhone,
    getAllCandidates,
    getUserIdByCandidateId,
    deleteCandidate,
};