const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.adminPanel);

// Удаление пользователя
router.post('/users/:id/delete', adminController.deleteUser);

// Удаление кандидата
router.post('/candidates/:id/delete', adminController.deleteCandidate);

// Удаление работодателя
router.post('/employers/:id/delete', adminController.deleteEmployer);

// Удаление вакансии
router.post('/vacancies/:id/delete', adminController.deleteVacancy);

// Удаление навыка
router.post('/skills/:id/delete', adminController.deleteSkill);

// Удаление связи кандидата и навыка
router.post('/candidate-skills/:candidateId/:skillId/delete', adminController.deleteCandidateSkill);

// Удаление связи вакансии и навыка
router.post('/vacancy-skills/:vacancyId/:skillId/delete', adminController.deleteVacancySkill);

// Удаление заявки
router.post('/applications/:id/delete', adminController.deleteApplication);

// Удаление резюме
router.post('/resumes/:id/delete', adminController.deleteResume);

// Удаление заявки на резюме
router.post('/resume-applications/:id/delete', adminController.deleteResumeApplication);

module.exports = router;