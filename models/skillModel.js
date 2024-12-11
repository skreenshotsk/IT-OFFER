const pool = require('../config/db');

const getAllSkills = async () => {
    const res = await pool.query('SELECT * FROM skills');
    return res.rows;
};

const deleteSkill = async (skillId) => {
    const query = 'DELETE FROM skills WHERE skill_id = $1 RETURNING *';
    const values = [skillId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

module.exports = {
    getAllSkills,
    deleteSkill,
};
