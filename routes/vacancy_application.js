const express = require('express');
const router = express.Router();
const { createApplication } = require('../models/applicationModel');
const { getCandidateByUserId } = require('../models/candidateModel');

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

    console.log('Vacancy ID: ', vacancyId);
    res.redirect('/vacancies');
});

module.exports = router;