const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }

    res.redirect('/adminLogin');
};

router.get('/', isAdmin, adminController.adminPanel);

// Удаление пользователя
router.post('/users/:id/delete', isAdmin, adminController.deleteUser);

// Удаление кандидата
router.post('/candidates/:id/delete', isAdmin, adminController.deleteCandidate);

// Удаление работодателя
router.post('/employers/:id/delete', isAdmin, adminController.deleteEmployer);

// Удаление вакансии
router.post('/vacancies/:id/delete', isAdmin, adminController.deleteVacancy);

// Удаление навыка
router.post('/skills/:id/delete', isAdmin, adminController.deleteSkill);

// Удаление связи кандидата и навыка
router.post('/candidate-skills/:candidateId/:skillId/delete', isAdmin, adminController.deleteCandidateSkill);

// Удаление связи вакансии и навыка
router.post('/vacancy-skills/:vacancyId/:skillId/delete', isAdmin, adminController.deleteVacancySkill);

// Удаление заявки
router.post('/applications/:id/delete', isAdmin, adminController.deleteApplication);

// Удаление резюме
router.post('/resumes/:id/delete', isAdmin, adminController.deleteResume);

// Удаление заявки на резюме
router.post('/resume-applications/:id/delete', isAdmin, adminController.deleteResumeApplication);

module.exports = router;