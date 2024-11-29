const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const resumeId = req.query.resume_id;
    console.log('Resume ID: ', resumeId);
    res.redirect('/vacancies');
});

module.exports = router;