const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userModel = require('../models/userModel');
const employerModel = require('../models/employerModel');
const vacancyModel = require('../models/vacancyModel');

// Маршрут для создания вакансии
router.post('/', userController.createUserVacancy);

// Маршрут для получения данных пользователя и вакансии
router.get('/', userController.getUserVacancy);

// Маршрут для отображения данных вакансии
router.get('/update', async (req, res) => {
    if (req.isAuthenticated()) {
        const user = await userModel.getUserByEmail(req.user.email);
        const employer = await employerModel.getEmployerByUserId(user.user_id);
        if (!employer) {
            return res.status(404).json({ success: false, message: 'Employer not found' });
        }
        const vacancy = await vacancyModel.getVacancyByEmployerId(employer.employer_id);
        res.render('update_vacancy', { user, vacancy, phone: employer.phone });
    } else {
        res.redirect('/auth/login');
    }
});

// Маршрут для обновления данных вакансии
router.post('/update', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const user = await userModel.getUserByEmail(req.user.email);
            const employer = await employerModel.getEmployerByUserId(user.user_id);
            if (!employer) {
                return res.status(404).json({ success: false, message: 'Employer not found' });
            }
            const vacancy = await vacancyModel.getVacancyByEmployerId(employer.employer_id);

            // Обработка данных вакансии
            const vacancyData = req.body;

            // Проверка валидности данных
            /*if (!vacancyData.title || !vacancyData.description || !vacancyData.salary || !vacancyData.location || !vacancyData.employmentType) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }*/

            // Обновление данных вакансии в базе данных
            await vacancyModel.updateVacancy(vacancy.vacancy_id, vacancyData);

            res.json({ success: true, message: 'Vacancy updated successfully' });
        } catch (error) {
            console.error('Error updating vacancy:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
});

module.exports = router;