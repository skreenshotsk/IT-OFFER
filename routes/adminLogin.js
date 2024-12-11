const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

router.get('/', (req, res) => {
    res.render('adminLogin');
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = 'SELECT * FROM admins WHERE username = $1';
        const { rows } = await pool.query(query, [username]);

        if (rows.length === 0) {
            return res.status(401).send('Неверные учетные данные');
        }

        const admin = rows[0];
        const passwordMatch = await bcrypt.compare(password, admin.password_hash);

        if (passwordMatch) {
            req.session.user = {
                role: 'admin',
            };
            return res.redirect('/admin');
        } else {
            res.status(401).send('Неверные учетные данные');
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router;