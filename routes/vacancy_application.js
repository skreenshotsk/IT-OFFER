const express = require('express');
const router = express.Router();
const { createApplication } = require('../models/applicationModel');
const { getCandidateByUserId, getUserIdByCandidateId } = require('../models/candidateModel');
const { getVacancyByEmployerId, getAllVacanciesByUserId } = require('../models/vacancyModel');
const { getEmployerByUserId } = require('../models/employerModel');
const { getApplicationByCandidateId, getCandidatesByVacancyId } = require('../models/applicationModel');
const { getResumeIdByEmployerId } = require('../models/resumeApplicationModel');
const { getUserById } = require('../models/userModel');
const { getResumeById } = require('../models/resumeModel');


router.get('/', async (req, res) => {
    const vacancyId = req.query.vacancy_id;
    const user = req.user;

    const candidate = await getCandidateByUserId(user.user_id);
    const candidateId = candidate.candidate_id;
    try{
        await createApplication({
            candidate_id: candidateId, vacancy_id: vacancyId, status: "pending" 
        });
    }catch (error) {
        console.error('Error creating vacancy:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/response_to_my_vacancies', async (req, res) => {
    const user = req.user;
    const employer = await getEmployerByUserId(user.user_id);
    const vacancies = await getAllVacanciesByUserId(user.user_id);
    
    try{
        // Получаем всех кандидатов для каждой вакансии
        const vacanciesWithCandidates = await Promise.all(vacancies.map(async (vacancy) => {
            const candidates = await getCandidatesByVacancyId(vacancy.vacancy_id);
            return { ...vacancy, candidates };
        }));
        const vacancy = vacanciesWithCandidates.length > 0 ? vacanciesWithCandidates[0] : null;
        const candidate = vacancy && vacancy.candidates.length > 0 ? vacancy.candidates[0] : null;
        const application = candidate ? await getApplicationByCandidateId(candidate.candidate_id) : null;
        const candidateUserId = candidate ? await getUserIdByCandidateId(candidate.candidate_id) : null;
        const candidateUser = candidateUserId ? await getUserById(candidateUserId) : null;

        //Получаем для отображения своих откликов
        const resumeId = await getResumeIdByEmployerId(employer.employer_id);
        const resume = await getResumeById(resumeId);//передавать массив, исправить позже

        res.render('my_responses_employer', {
            resume,
            user,
            employer,
            vacancies: vacanciesWithCandidates,
            vacancy,
            candidate: candidate[0],
            application,
            candidateUser
        });
    }catch (error) {
        console.error('Error creating vacancy:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;