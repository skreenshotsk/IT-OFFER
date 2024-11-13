// routes/register.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Маршрут для отображения формы регистрации
router.get('/', (req, res) => {
    const skills = ['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'TypeScript', 'SQL', 'R', 'MATLAB', 'Perl', 'Scala', 'Haskell'];
    res.render('register', { skills });
});

// Маршрут для обработки регистрации пользователя
router.post('/', userController.registerUser);

module.exports = router;