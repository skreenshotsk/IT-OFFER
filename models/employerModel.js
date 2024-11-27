const pool = require('../config/db');

// Создать работодателя
const createEmployer = async (employer) => {
    const { user_id, company_name, description, website, legal_address, project_photo, company_logo, project_description } = employer;
    console.log('Employer data:', employer);
    const query = `
        INSERT INTO employers (user_id, company_name, description, website, legal_address, project_photo, company_logo, project_description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const values = [user_id, company_name, description, website, legal_address, project_photo, company_logo, project_description];
    console.log('mod: ', values);
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Получение данных работодателя по user_id
const getEmployerByUserId = async (userId) => {
    try {
        const query = 'SELECT * FROM employers WHERE user_id = $1';
        const { rows } = await pool.query(query, [userId]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching employer by user_id:', error);
        throw error;
    }
};

// Получить работодателя по employer_id
const getEmployerByEmployerId = async (employerId) => {
    const query = 'SELECT * FROM employers WHERE employer_id = $1';
    const values = [employerId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

// Получить название компании по employer_id
const getCompanyNameByEmployerId = async (employerId) => {
    const query = 'SELECT company_name FROM employers WHERE employer_id = $1';
    const values = [employerId];
    const res = await pool.query(query, values);
    return res.rows[0] ? res.rows[0].company_name : null;
};

const getAllEmployers = async () => {
    const res = await pool.query('SELECT * FROM employers');
    return res.rows;
};

const getAllCompanyNames = async () => {
    try {
        const query = 'SELECT company_name FROM employers';
        const { rows } = await pool.query(query);
        return rows.map(row => row.company_name);
    } catch (error) {
        console.error('Error fetching company names:', error);
        throw error;
    }
};

module.exports = {
    createEmployer,
    getEmployerByUserId,
    getEmployerByEmployerId,
    getAllEmployers,
    getCompanyNameByEmployerId,
    getAllCompanyNames,
};