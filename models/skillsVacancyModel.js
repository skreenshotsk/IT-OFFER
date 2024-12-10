const pool = require('../config/db');

const getAllVacancySkills = async () => {
    const res = await pool.query(`
        SELECT vs.vacancy_id, vs.skill_id, s.skill_name
        FROM vacancy_skills vs
        INNER JOIN skills s ON vs.skill_id = s.skill_id
    `);
    return res.rows;
};

const deleteVacancySkill = async (vacancyId, skillId) => {
    const query = 'DELETE FROM vacancy_skills WHERE vacancy_id = $1 AND skill_id = $2 RETURNING *';
    const values = [vacancyId, skillId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

module.exports = {
    getAllVacancySkills,
    deleteVacancySkill,
};