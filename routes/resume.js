const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Маршрут для создания резюме
router.post('/', userController.createUserResume);

// Маршрут для получения данных пользователя и резюме
router.get('/', userController.getUserResume);

// Маршрут для обновления данных резюме
router.post('/', userController.updateUserResume);

module.exports = router;