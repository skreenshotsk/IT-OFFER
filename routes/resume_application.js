const express = require('express');
const router = express.Router();
const { getAllVacancyIdsByCandidateId } = require('../models/applicationModel');
const { getEmployerByUserId, getEmployerByEmployerId } = require('../models/employerModel');
const { getCandidateByUserId } = require('../models/candidateModel');
const { createResumeApplication, getApplicationsResumeByResumeId, getAllEmployerIdsByResumeId, updateResumeApplicationStatus } = require('../models/resumeApplicationModel');
const { getVacancyById } = require('../models/vacancyModel');
const { getUserById } = require('../models/userModel');
const { getResumeByCandidateId } = require('../models/resumeModel');

router.get('/', async (req, res) => {
    const resumeId = req.query.resume_id;
    const user = req.user;
    const employer = await getEmployerByUserId(user.user_id);
    const employerId = employer.employer_id;
    try {
        await createResumeApplication({
            employer_id: employerId, resume_id: resumeId, status: "pending"
        });
    } catch (error) {
        console.error('Error creating vacancy:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/response_to_my_resumes', async (req, res) => {
    const user = req.user;

    try {
        const candidate = await getCandidateByUserId(user.user_id);
        const resume = await getResumeByCandidateId(candidate.candidate_id);
        const employerIds = await getAllEmployerIdsByResumeId(resume.resume_id);
        const employers = await Promise.all(employerIds.map(employerId => getEmployerByEmployerId(employerId)));
        const applications = await getApplicationsResumeByResumeId(resume.resume_id);
        
        const vacancyIds = await getAllVacancyIdsByCandidateId(candidate.candidate_id);
        const vacancies = await Promise.all(vacancyIds.map(vacancyId => getVacancyById(vacancyId)));

        console.log(employers);
        res.render('my_responses_candidate', {
            resume,
            user,
            candidate,
            employers,
            applications,
            vacancies
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/accept-response', async (req, res) => {
    const { responseId } = req.body;
  
    try {
      await updateResumeApplicationStatus(responseId, { status: 'accepted' });
      console.log(req.body);
      res.redirect('/resume_application/response_to_my_vacancies');
    } catch (error) {
      res.status(500).send('Ошибка при обновлении статуса');
    }
});

module.exports = router;