// models/employerModel.js
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

module.exports = {
    createEmployer,
};