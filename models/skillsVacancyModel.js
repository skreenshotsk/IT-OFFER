const pool = require('../config/db');

const getAllVacancySkills = async () => {
    const res = await pool.query(`
        SELECT vs.vacancy_id, vs.skill_id, s.skill_name
        FROM vacancy_skills vs
        INNER JOIN skills s ON vs.skill_id = s.skill_id
    `);
    return res.rows;
};

module.exports = {
    getAllVacancySkills
};