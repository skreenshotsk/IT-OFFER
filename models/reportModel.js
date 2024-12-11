const pool = require('../config/db');

// Функция для получения данных из представления skill_salary_view
const getSkillSalaryView = async () => {
    const query = `
        SELECT * FROM skill_salary_view
        ORDER BY average_salary DESC;
    `;
    try {
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching skill salary view:', error);
        throw error;
    }
};

// Функция для получения данных из представления vacancies_with_applications
const getVacanciesWithApplications = async () => {
    const query = `
        SELECT * FROM vacancies_with_applications
        ORDER BY application_count DESC;
    `;
    try {
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching vacancies with applications:', error);
        throw error;
    }
};

// Функция для получения данных из представления vacancies_without_applications
const getVacanciesWithoutApplications = async () => {
    const query = `
        SELECT * FROM vacancies_without_applications
        ORDER BY vacancy_title;
    `;
    try {
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching vacancies without applications:', error);
        throw error;
    }
};

module.exports = {
    getSkillSalaryView,
    getVacanciesWithApplications,
    getVacanciesWithoutApplications,
};