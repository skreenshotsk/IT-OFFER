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

// Получить кандидата по user_id
const getCandidateByUserId = async (userId) => {
    const query = 'SELECT * FROM candidates WHERE user_id = $1';
    const values = [userId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

module.exports = {
    createCandidate,
    updateCandidate,
    getCandidateByUserId,
};