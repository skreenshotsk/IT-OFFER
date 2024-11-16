// models/candidateModel.js
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

module.exports = {
    createCandidate,
};