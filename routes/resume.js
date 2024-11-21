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

// Маршрут для обновления данных резюме
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

module.exports = router;