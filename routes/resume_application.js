const express = require('express');
const router = express.Router();
const { createResumeApplication } = require('../models/resumeApplicationModel');
const { getEmployerByUserId, getEmployerByEmployerId } = require('../models/employerModel');
const { getCandidateByUserId } = require('../models/candidateModel');
const { getApplicationsByCandidateId } = require('../models/resumeApplicationModel');
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
    const candidate = await getCandidateByUserId(user.user_id);
    const resume = await getResumeByCandidateId(candidate.candidate_id);
    try {
        const applications = await getApplicationsByCandidateId(candidate.candidate_id);

        // Fetch vacancies and employers for each application
        const applicationsWithDetails = await Promise.all(
            applications.map(async (application) => {
                const vacancy = await getVacancyById(application.vacancy_id);
                const employer = await getEmployerByEmployerId(vacancy.employer_id);
                const employerUser = await getUserById(employer.user_id);
                return { ...application, vacancy, employer, employerUser };
            })
        );

        // Render the template with the fetched data
        res.render('my_responses_candidate', {
            resume,
            user,
            candidate,
            applications: applicationsWithDetails
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;