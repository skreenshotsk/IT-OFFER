const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { createUser, getUserByEmail, updateUser } = require('../models/userModel');

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
        return res.redirect('/auth/profile');
      });
    })(req, res, next);
  });

// Выход
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Страница профиля
router.get('/profile', async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await getUserByEmail(req.user.email);
    res.render('profile', { user });
  } else {
    res.redirect('/auth/login');
  }
});

// Обработка сохранения изменений профиля
router.post('/profile', async (req, res) => {
  if (req.isAuthenticated()) {
    const { last_name, first_name, email, phone_num, password_hash } = req.body;
    const userId = req.user.user_id;
    const user = { last_name, first_name, email, phone_num, password_hash };
    try {
      await updateUser(userId, user);
      res.json({ success: true });
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      res.status(500).json({ success: false, message: 'Ошибка при обновлении пользователя' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Пользователь не аутентифицирован' });
  }
});

module.exports = router;


//все маршруты связанные с ауф писать через ауф
//  /auth/login  /auth/profile