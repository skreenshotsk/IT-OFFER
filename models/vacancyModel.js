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

const getAllVacanciesAdmin = async () => {
    const res = await pool.query('SELECT * FROM vacancies');
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

// Получить вакансию по employer_id
const getVacancyByEmployerId = async (employerId) => {
    const query = 'SELECT * FROM vacancies WHERE employer_id = $1';
    const values = [employerId];
    const res = await pool.query(query, values);
    return res.rows;
};

module.exports = {
    getAllVacancies,
    getVacancyById,
    getVacancySkills,
    getVacancyByEmployerId,
    getAllVacanciesAdmin,
};
