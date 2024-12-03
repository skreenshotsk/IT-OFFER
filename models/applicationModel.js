const pool = require('../config/db');

const getAllApplications = async () => {
    const res = await pool.query(`
        SELECT application_id, candidate_id, vacancy_id, status, applied_at
        FROM applications
    `);
    return res.rows;
};

const createApplication = async (applicationData) => {
    const { candidate_id, vacancy_id, status } = applicationData;
    const query = `
        INSERT INTO applications (candidate_id, vacancy_id, status)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [candidate_id, vacancy_id, status || 'pending'];
    const res = await pool.query(query, values);
    return res.rows[0];
};

const getApplicationByCandidateId = async (candidateId) => {
    try {
        const query = `
            SELECT * FROM applications
            WHERE candidate_id = $1
            LIMIT 1;
        `;
        const values = [candidateId];
        const { rows } = await pool.query(query, values);
        return rows[0]; // Возвращаем первую запись
    } catch (error) {
        console.error('Error finding application by candidate_id:', error);
        throw error;
    }
};

const getCandidatesByVacancyId = async (vacancyId) => {
    try {
        const query = `
            SELECT c.*
            FROM applications a
            JOIN candidates c ON a.candidate_id = c.candidate_id
            WHERE a.vacancy_id = $1;
        `;
        const values = [vacancyId];
        const { rows } = await pool.query(query, values);
        return rows;
    } catch (error) {
        console.error('Error fetching candidates by vacancy_id:', error);
        throw error;
    }
};

const getAllVacancyIdsByCandidateId = async (candidateId) => {
    try {
        const { rows } = await pool.query(
            'SELECT vacancy_id FROM applications WHERE candidate_id = $1',
            [candidateId]
        );
        return rows.map(row => row.vacancy_id);
    } catch (err) {
        throw new Error('Ошибка при получении vacancy_id: ' + err.message);
    }
};

module.exports = {
    getAllApplications,
    createApplication,
    getApplicationByCandidateId,
    getCandidatesByVacancyId,
    getAllVacancyIdsByCandidateId
};