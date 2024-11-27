const express = require('express');
const router = express.Router();
const { getEmployerByUserId } = require('../models/employerModel');

// Маршрут для рендеринга страницы add_vacancy
router.get('/', async (req, res) => {
    const user = req.user;
    try {
        const employer = await getEmployerByUserId(user.user_id);
        res.render('add_vacancy', { user: req.user, employer });
    } catch (error) {
        console.error('Error rendering add_vacancy page:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;