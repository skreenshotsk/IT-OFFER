const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const vacancyId = req.query.vacancy_id;
    console.log('Vacancy ID: ', vacancyId);
    res.redirect('/vacancies');
});

module.exports = router;