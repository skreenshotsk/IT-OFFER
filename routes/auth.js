const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { createUser, getUserByEmail, updateUser } = require('../models/userModel');
const candidateModel = require('../models/candidateModel');
const { getEmployerByUserId, getCompanyNameByEmployerId } = require('../models/employerModel');
const resumeModel = require('../models/resumeModel');

const router = express.Router();

// Страница регистрации
router.get('/register', (req, res) => {
  res.render('register', { user: req.user, skills });
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
    res.render('login', { user: req.user });
});

// Обработка входа
router.post('/login', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/auth/login');
      }
      req.logIn(user, async (err) => {
        if (err) {
          return next(err);
        }
        console.log(`Пользователь ${user.email} успешно вошел в аккаунт.`);
        // Проверка наличия резюме
        let hasResume = false;
        if (user.user_type === 'candidate') {
            const candidate = await candidateModel.getCandidateByUserId(user.user_id);
            if (candidate) {
                const resume = await resumeModel.getResumeByCandidateId(candidate.candidate_id);
                hasResume = !!resume;
            }
        }

        // Сохранение информации о наличии резюме в сессии
        req.session.hasResume = hasResume;

        return res.redirect('/auth/profile');
      });
    })(req, res, next);
  });

// Выход
router.get('/logout', (req, res, next) => {
  console.log(`Пользователь вышел из аккаунта.`);
  req.logout((err) => {
    if (err) {
      console.error('Ошибка при выходе из аккаунта:', err);
      return next(err); // Передаем ошибку в обработчик ошибок
    }
    res.redirect('/'); // Перенаправляем на главную страницу
  });
});


// Страница профиля
router.get('/profile', async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await getUserByEmail(req.user.email);
    const employer = await getEmployerByUserId(user.user_id);
    let companyName = null;
    if (user.user_type === 'employer') { 
      companyName = await getCompanyNameByEmployerId(employer.employer_id);
    }
    const hasResume = req.session.hasResume || false; // Получение hasResume из сесси
    res.render('profile', { user, hasResume, companyName });
  } else {
    res.redirect('/auth/login');
  }
});

// Обработка сохранения изменений профиля
router.post('/profile', async (req, res) => {
  if (req.isAuthenticated()) {
    const { last_name, first_name, email, phone_num, password_hash, user_type } = req.body;
    const userId = req.user.user_id;
    const user = { last_name, first_name, email, phone_num, password_hash, user_type };
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

// Маршрут для обновления резюме
//router.post('/resume/update', userController.updateUserResume);

module.exports = router;


//все маршруты связанные с ауф писать через ауф
//  /auth/login  /auth/profile