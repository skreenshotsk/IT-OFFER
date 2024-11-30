const express = require('express');
const router = express.Router();
const { createApplication } = require('../models/applicationModel');
const { getCandidateByUserId } = require('../models/candidateModel');
const { getVacancyByEmployerId, getAllVacanciesByUserId } = require('../models/vacancyModel');
const { getEmployerByUserId } = require('../models/employerModel');
const { getApplicationByCandidateId, getCandidatesByVacancyId } = require('../models/applicationModel');


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
    const vacancy = await getVacancyByEmployerId(employer.employer_id);
    console.log(vacancy);
    //const candidate = await getCandidatesByVacancyId(vacancy.vacancy_id);
    //console.log(candidate);
    //const application = await getApplicationByCandidateId(candidate.candidate_id);
    try{
        // Получаем всех кандидатов для каждой вакансии
        const vacanciesWithCandidates = await Promise.all(vacancies.map(async (vacancy) => {
            const candidates = await getCandidatesByVacancyId(vacancy.vacancy_id);
            return { ...vacancy, candidates };
        }));

        // Выбираем первую вакансию для отображения
        const vacancy = vacanciesWithCandidates.length > 0 ? vacanciesWithCandidates[0] : null;
        const candidate = vacancy && vacancy.candidates.length > 0 ? vacancy.candidates[0] : null;
        const application = candidate ? await getApplicationByCandidateId(candidate.candidate_id) : null;

        res.render('my_responses_employer', {
            user,
            employer,
            vacancies: vacanciesWithCandidates,
            vacancy,
            candidate,
            application
        });
        //res.render('my_responses_employer', { vacancies, user, employer, vacancy, candidate, application });
    }catch (error) {
        console.error('Error creating vacancy:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;