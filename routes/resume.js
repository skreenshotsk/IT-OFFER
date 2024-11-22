const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userModel = require('../models/userModel');
const candidateModel = require('../models/candidateModel');
const resumeModel = require('../models/resumeModel');

// Маршрут для создания резюме
router.post('/', userController.createUserResume);

// Маршрут для получения данных пользователя и резюме
router.get('/', userController.getUserResume);

//router.post('/', userController.updateUserResume);

// Маршрут для отображения данных резюме
router.get('/update', async (req, res) => {
    if (req.isAuthenticated()) {
        const user = await userModel.getUserByEmail(req.user.email);
        const candidate = await candidateModel.getCandidateByUserId(user.user_id);
        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }
        const resume = await resumeModel.getResumeByCandidateId(candidate.candidate_id);
        res.render('update_cv', { user, resume });
    } else {
        res.redirect('/auth/login');
    }
});

// Маршрут для обновления данных резюме
router.post('/update', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const user = await userModel.getUserByEmail(req.user.email);
            const candidate = await candidateModel.getCandidateByUserId(user.user_id);
            if (!candidate) {
                return res.status(404).json({ success: false, message: 'Candidate not found' });
            }
            const resume = await resumeModel.getResumeByCandidateId(candidate.candidate_id);

            // Обработка данных резюме
            const resumeData = req.body;

            // Проверка валидности данных
            /*if (!resumeData.lastName || !resumeData.firstName || !resumeData.location || !resumeData.birthDate || !resumeData.phone || !resumeData.citizenship) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }*/

            // Обновление данных резюме в базе данных
           await resumeModel.updateResume(resume.resume_id, resumeData);
           console.log('123', resumeData);

            res.json({ success: true, message: 'Resume updated successfully' });
        } catch (error) {
            console.error('Error updating resume:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
});

module.exports = router;