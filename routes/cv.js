const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Маршрут для получения всех резюме
router.get('/', userController.getAllResumes);

// Маршрут для получения резюме по ID
router.get('/:id', userController.getResumeById);

module.exports = router;