const pool = require('../config/db');

const getAllCandidateSkills = async () => {
    const res = await pool.query(`
        SELECT cs.candidate_id, cs.skill_id, s.skill_name
        FROM candidate_skills cs
        INNER JOIN skills s ON cs.skill_id = s.skill_id
    `);
    return res.rows;
};

const deleteCandidateSkill = async (candidateId, skillId) => {
    const query = 'DELETE FROM candidate_skills WHERE candidate_id = $1 AND skill_id = $2 RETURNING *';
    const values = [candidateId, skillId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

module.exports = {
    getAllCandidateSkills,
    deleteCandidateSkill,
};