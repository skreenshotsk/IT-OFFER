const express = require('express');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const cvRouter = require('./routes/cv');
const vacanciesRoutes = require('./routes/vacancies');
const registerRoutes = require('./routes/register');
const vacancyRoutes = require('./routes/vacancy');
const resumeRoutes = require('./routes/resume');
const adminRouter = require('./routes/admin');
const adminLoginRouter = require('./routes/adminLogin');
const myVacanciesRoutes = require('./routes/my_vacancies');
const resume_applicationRouter = require('./routes/resume_application');
const vacancy_applicationRouter = require('./routes/vacancy_application');

const app = express();
const PORT = 8000;

// Настройка сессий
app.use(session({
    secret: 'yoursecret',
    resave: false,
    saveUninitialized: false
  }));
  
  // Инициализация Passport
  app.use(passport.initialize());
  app.use(passport.session());

// Указываем папку public для статических файлов
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));  // Установка папки для шаблонов
app.set('view engine', 'ejs');  // Установка движка шаблонов

app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение маршрутов
app.use('/vacancy_application', vacancy_applicationRouter);
app.use('/resume_application', resume_applicationRouter);
app.use('/my_vacancy', myVacanciesRoutes);
app.use('/adminLogin', adminLoginRouter);
app.use('/vacancies', vacanciesRoutes);
app.use('/register', registerRoutes);
app.use('/vacancy', vacancyRoutes);
app.use('/resume', resumeRoutes);
app.use('/admin', adminRouter);
app.use('/auth', authRoutes);
app.use('/cv', cvRouter);



app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
      } else if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
      }
  }
}));

// Настройка маршрутов
/*app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});*/

// Главная страница
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

