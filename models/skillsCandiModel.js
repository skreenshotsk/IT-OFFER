const pool = require('../config/db');

const getAllCandidateSkills = async () => {
    const res = await pool.query(`
        SELECT cs.candidate_id, cs.skill_id, s.skill_name
        FROM candidate_skills cs
        INNER JOIN skills s ON cs.skill_id = s.skill_id
    `);
    return res.rows;
};

module.exports = {
    getAllCandidateSkills,
};