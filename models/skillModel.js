// models/skillModel.js
const pool = require('../config/db');

// Получить все навыки
const getAllSkills = async () => {
    const res = await pool.query('SELECT * FROM skills');
    return res.rows;
};

module.exports = {
    getAllSkills,
};
