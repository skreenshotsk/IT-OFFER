const express = require('express');
const router = express.Router();
const vacancyModel = require('../models/vacancyModel');
const skillModel = require('../models/skillModel');

router.get('/', async (req, res) => {
    try {
        const vacancies = await vacancyModel.getAllVacancies();
        const vacancySkills = await vacancyModel.getVacancySkills();
        const skills = await skillModel.getAllSkills();

        // Отправляем данные в шаблон
        res.render('vacancies', { 
            vacancies,
            skills,
            vacancySkills,
            user: req.user,
        });
    } catch (err) {
        console.error('Ошибка при получении данных вакансий:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
