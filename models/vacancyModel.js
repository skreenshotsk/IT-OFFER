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

const getVacancySkills = async () => {
    const res = await pool.query(`
        SELECT v.vacancy_id, v.title, s.skill_name
        FROM vacancies v
        JOIN vacancy_skills vs ON vs.vacancy_id = v.vacancy_id
        JOIN skills s ON s.skill_id = vs.skill_id
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
    getVacancySkills,
};
