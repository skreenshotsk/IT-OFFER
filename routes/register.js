const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const skillModel = require('../models/skillModel');


// Маршрут для отображения формы регистрации, указать как асинхронная async
router.get('/', async (req, res) => {
    try {
        const skills = await skillModel.getAllSkills();
        //console.log('sk: ', skills);
        res.render('register', { skills, user: req.user });
    } catch (err) {
        console.error('Ошибка при получении данных навыков:', err);
        res.status(500).json({ error: err.message });
    }
});

// Маршрут для обработки регистрации пользователя
router.post('/', userController.registerUser);

module.exports = router;