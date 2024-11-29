const express = require('express');
const router = express.Router();
const { createApplication } = require('../models/applicationModel');
const { getCandidateByUserId } = require('../models/candidateModel');
const { getVacancyByEmployerId } = require('../models/vacancyModel');
const { getEmployerByUserId } = require('../models/employerModel');
const { getApplicationByCandidateId } = require('../models/applicationModel');


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
    const vacancy = await getVacancyByEmployerId(employer.employer_id);
    const candidate = await getCandidateByUserId(user.user_id);
    console.log(candidate);
    const application = await getApplicationByCandidateId(candidate.candidate_id);
    try{
        res.render('/my_responses_employer', { user, employer, vacancy, candidate, application });
    }catch (error) {
        console.error('Error creating vacancy:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;