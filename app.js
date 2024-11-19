const express = require('express');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const vacanciesRoutes = require('./routes/vacancies');
const registerRoutes = require('./routes/register');

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
app.use('/vacancies', vacanciesRoutes);
app.use('/register', registerRoutes);
app.use('/auth', authRoutes);


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
  res.render('index');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

