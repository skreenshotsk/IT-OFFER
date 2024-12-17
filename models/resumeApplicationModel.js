const pool = require('../config/db');

const getAllResumeApplications = async () => {
    const res = await pool.query(`
        SELECT application_id, employer_id, resume_id, status, applied_at
        FROM resume_applications
    `);
    return res.rows;
};

const createResumeApplication = async (applicationData) => {
    const { employer_id, resume_id, status } = applicationData;
    const query = `
        INSERT INTO resume_applications (employer_id, resume_id, status)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [employer_id, resume_id, status || 'pending'];
    const res = await pool.query(query, values);
    return res.rows[0];
};

/*const getResumeIdByEmployerId = async (employerId) => {
    const query = 'SELECT resume_id FROM resume_applications WHERE employer_id = $1';
    const values = [employerId];
    const res = await pool.query(query, values);
    return res.rows.length > 0 ? res.rows[0].resume_id : null;
};*/

const getResumeIdByEmployerId = async (employerId) => {
    const query = 'SELECT resume_id FROM resume_applications WHERE employer_id = $1';
    const values = [employerId];
    const res = await pool.query(query, values);
    // Extract resume_ids into an array
    const resumeIds = res.rows.map(row => row.resume_id);
    return resumeIds;
};

const getApplicationsByCandidateId = async (candidate_id) => {
    const query = 'SELECT * FROM applications WHERE candidate_id = $1';
    const values = [candidate_id];
    const { rows } = await pool.query(query, values);
    return rows;
};

const getAllEmployerIdsByResumeId = async (resumeId) => {
    try {
        const { rows } = await pool.query(
            'SELECT employer_id FROM resume_applications WHERE resume_id = $1',
            [resumeId]
        );
        return rows.map(row => row.employer_id);
    } catch (err) {
        throw new Error('Ошибка при получении employer_id: ' + err.message);
    }
};

const getApplicationsResumeByResumeId = async (resumeId) => {
    try {
        const { rows } = await pool.query(
            `SELECT *
            FROM resume_applications 
            WHERE resume_id = $1`,
            [resumeId]
        );
        return rows;
    } catch (err) {
        throw new Error('Ошибка при получении заявок на резюме: ' + err.message);
    }
};

const deleteResumeApplication = async (resumeApplicationId) => {
    const query = 'DELETE FROM resume_applications WHERE application_id = $1 RETURNING *';
    const values = [resumeApplicationId];
    const res = await pool.query(query, values);
    return res.rows[0];
};

const updateResumeApplicationStatus = async (application_id) => {
    const query = `
        UPDATE resume_applications
        SET status = 'accepted'
        WHERE application_id = $1
        RETURNING *;
    `;
    const values = [application_id];

    try {
        const res = await pool.query(query, values);
        if (res.rows.length > 0) {
            return res.rows[0];
        } else {
            throw new Error('Заявка с указанным application_id не найдена');
        }
    } catch (error) {
        console.error('Ошибка при обновлении статуса заявки:', error);
        throw error;
    }
};

module.exports = {
    getAllResumeApplications,
    createResumeApplication,
    getResumeIdByEmployerId,
    getApplicationsByCandidateId,
    getAllEmployerIdsByResumeId,
    getApplicationsResumeByResumeId,
    deleteResumeApplication,
    updateResumeApplicationStatus,
};