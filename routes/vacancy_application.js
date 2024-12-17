const express = require('express');
const router = express.Router();
const { createApplication, updateApplicationStatus } = require('../models/applicationModel');
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
        //const resumeId = await getResumeIdByEmployerId(employer.employer_id);
        //const resume = await getResumeById(resumeId);
        //const resumeIds = await getResumeIdByEmployerId(employer.employer_id);
        //const resumes = await Promise.all(resumeIds.map(id => getResumeById(id)));
        let resumeIds = await getResumeIdByEmployerId(employer.employer_id);
        if (!Array.isArray(resumeIds)) {
            resumeIds = [];
        }
        console.log('id', resumeIds);
        
        const resumePromises = resumeIds.map(async id => {
            try {
                return await getResumeById(id);
            } catch (error) {
                console.error('Error fetching resume by ID:', id, error);
                return null;
            }
        });
        
        const resumes = await Promise.all(resumePromises);
        console.log('resumes', resumes);

        res.render('my_responses_employer', {
            //resume,
            resumes,
            user,
            employer,
            vacancies: vacanciesWithCandidates
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/accept-response', async (req, res) => {
    const { responseId } = req.body;
  
    try {
      await updateApplicationStatus(responseId, { status: 'accepted' });
      console.log(req.body);
      res.redirect('/vacancy_application/response_to_my_vacancies');
    } catch (error) {
      res.status(500).send('Ошибка при обновлении статуса');
    }
});

module.exports = router;