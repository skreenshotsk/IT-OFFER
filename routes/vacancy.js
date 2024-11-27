const express = require('express');
const router = express.Router();
const { getEmployerByUserId } = require('../models/employerModel');
const { createVacancy } = require('../models/vacancyModel');

// Маршрут для рендеринга страницы add_vacancy
router.get('/', async (req, res) => {
    const user = req.user;
    try {
        const employer = await getEmployerByUserId(user.user_id);
        res.render('add_vacancy', { user: req.user, employer });
    } catch (error) {
        console.error('Error rendering add_vacancy page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Обработчик POST-запроса для создания новой вакансии
router.post('/', async (req, res) => {
    const user = req.user;
    const employer = await getEmployerByUserId(user.user_id);
    const emp_id = employer.employer_id;
    const { title, location, description, salary_min, salary_max, schedule, education, 
            experience, contact_email, contact_phone, contact_person, employment_type } = req.body;
    try {

        await createVacancy({
            employer_id: emp_id, title, location, description, salary_min, salary_max, schedule, education, 
            experience, currency: 'RUB', contact_email, contact_phone, contact_person, employment_type
        });

        res.redirect('/auth/profile');
    } catch (error) {
        console.error('Error creating vacancy:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;