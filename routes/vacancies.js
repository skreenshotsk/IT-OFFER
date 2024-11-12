const express = require('express');
const router = express.Router();
const vacancyModel = require('../models/vacancyModel'); // Подключаем модель для вакансий
const skillModel = require('../models/skillModel');   // Подключаем модель для навыков (если такая существует)

// Рендеринг страницы вакансий
router.get('/', async (req, res) => {
    try {
        // Получаем все вакансии из базы данных
        const vacancies = await vacancyModel.getAllVacancies();
        const vacancySkills = await vacancyModel.getVacancySkills();
        
        // Логируем вакансии для отладки
        console.log("-----------------");
        console.log(vacancies);
        console.log("-----------------");
        console.log(vacancySkills);
        console.log("-----------------");

        // Получаем список навыков из базы данных
        const skills = await skillModel.getAllSkills();
        
        // Логируем список навыков для отладки
        console.log(skills);

        // Отправляем данные в шаблон
        res.render('vacancies', { 
            title: 'Вакансии',
            vacancies: vacancies,
            skills: skills,
            vacancySkills: vacancySkills,
        });
    } catch (err) {
        console.error('Ошибка при получении данных вакансий:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
