const express = require('express');
const router = express.Router();
const vacancyModel = require('../models/vacancyModel'); // Подключаем модели
const skillModel = require('../models/skillModel');

// Рендеринг страницы вакансий
router.get('/', async (req, res) => {
    try {
        // Получаем все вакансии из базы данных
        const vacancies = await vacancyModel.getAllVacancies();
        const vacancySkills = await vacancyModel.getVacancySkills();

        // Получаем список навыков из базы данных
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
