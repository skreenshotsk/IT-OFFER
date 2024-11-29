const express = require('express');
const router = express.Router();
const { createVacancyApplication } = require('../models/applicationModel');

router.get('/', async (req, res) => {
    const vacancyId = req.query.vacancy_id;
    const user = req.user;
    
    console.log('Vacancy ID: ', vacancyId);
    res.redirect('/vacancies');
});

module.exports = router;