const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { createUser } = require('../models/userModel');

const router = express.Router();

// Страница регистрации
router.get('/register', (req, res) => {
  res.render('register');
});

// Обработка регистрации
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, phone_num, password, user_type } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  const user = { first_name, last_name, email, phone_num, password_hash, user_type };
  await createUser(user);
  res.redirect('/auth/login');
});

// Страница входа
router.get('/login', (req, res) => {
    res.render('login');
});

// Обработка входа
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/auth/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        console.log(`Пользователь ${user.email} успешно вошел в аккаунт.`);
        return res.redirect('/');
      });
    })(req, res, next);
  });

// Выход
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;