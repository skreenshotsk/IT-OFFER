const express = require('express');
const router = express.Router();
const { createResumeApplication } = require('../models/resumeApplicationModel');
const { getEmployerByUserId } = require('../models/employerModel');

router.get('/', async (req, res) => {
    const resumeId = req.query.resume_id;
    const user = req.user;
    const employer = await getEmployerByUserId(user.user_id);
    const employerId = employer.employer_id;
    try{
        await createResumeApplication({
            employer_id: employerId, resume_id: resumeId, status: "pending" 
        });
    }catch (error) {
        console.error('Error creating vacancy:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;