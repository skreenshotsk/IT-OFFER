const pool = require('../config/db');

const candidateSkillModel = {
    // Получение всех навыков для конкретного кандидата
    getSkillsByCandidateId: async (candidateId) => {
        try {
            const [rows] = await db.query('SELECT skill_id FROM candidate_skills WHERE candidate_id = ?', [candidateId]);
            return rows.map(row => row.skill_id);
        } catch (err) {
            console.error('Ошибка при получении навыков кандидата:', err);
            throw err;
        }
    },

    // Добавление навыка кандидату
    addSkillToCandidate: async (candidateId, skillId) => {                   //изменено
        try {
            const query = `
                INSERT INTO candidate_skills (candidate_id, skill_id)
                VALUES ($1, $2);
            `;
            const values = [candidateId, skillId];
            await pool.query(query, values);
        } catch (err) {
            console.error('Ошибка при добавлении навыка кандидату:', err);
            throw err;
        }
    },
    

    // Удаление навыка у кандидата
    removeSkillFromCandidate: async (candidateId, skillId) => {
        try {
            await db.query('DELETE FROM candidate_skills WHERE candidate_id = ? AND skill_id = ?', [candidateId, skillId]);
        } catch (err) {
            console.error('Ошибка при удалении навыка у кандидата:', err);
            throw err;
        }
    },

    // Получение всех кандидатов с их навыками
    getAllCandidatesWithSkills: async () => {
        try {
            const [rows] = await db.query(`
                SELECT c.candidate_id, c.name AS candidate_name, GROUP_CONCAT(cs.skill_id) AS skills
                FROM candidates c
                LEFT JOIN candidate_skills cs ON c.candidate_id = cs.candidate_id
                GROUP BY c.candidate_id
            `);
            return rows.map(row => ({
                candidate_id: row.candidate_id,
                candidate_name: row.candidate_name,
                skills: row.skills ? row.skills.split(',').map(Number) : []
            }));
        } catch (err) {
            console.error('Ошибка при получении всех кандидатов с их навыками:', err);
            throw err;
        }
    }
};

module.exports = candidateSkillModel;