// models/vacancyModel.js
const pool = require('../config/db');

// Получить все вакансии
const getAllVacancies = async () => {
    const res = await pool.query(`
        SELECT v.vacancy_id, v.title, v.description, v.salary_max, v.location, e.company_name
        FROM vacancies v
        JOIN employers e ON v.employer_id = e.employer_id
    `);
    return res.rows;
};

// Получить вакансию по ID
const getVacancyById = async (id) => {
    const res = await pool.query('SELECT * FROM vacancies WHERE vacancy_id = $1', [id]);
    return res.rows[0];
};

module.exports = {
    getAllVacancies,
    getVacancyById,
};
