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

    try {
        // Fetch candidates for each vacancy and their associated user data
        const vacanciesWithCandidates = await Promise.all(vacancies.map(async (vacancy) => {
            const candidates = await getCandidatesByVacancyId(vacancy.vacancy_id);
            // Fetch candidateUser for each candidate
            const candidatesWithUser = await Promise.all(candidates.map(async (candidate) => {
                const application = await getApplicationByCandidateId(candidate.candidate_id);
                const candidateUserId = await getUserIdByCandidateId(candidate.candidate_id);
                const candidateUser = candidateUserId ? await getUserById(candidateUserId) : null;
                return { ...candidate, application, candidateUser };
            }));
            return { ...vacancy, candidates: candidatesWithUser };
        }));

        // Fetch resume data for the employer
        const resumeId = await getResumeIdByEmployerId(employer.employer_id);
        const resume = await getResumeById(resumeId);

        res.render('my_responses_employer', {
            resume,
            user,
            employer,
            vacancies: vacanciesWithCandidates
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;