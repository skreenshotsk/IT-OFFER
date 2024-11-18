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

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    next();
});

app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'nonce-cLWD16dFrLW0F2XfFRiPWQ==' https://cdnjs.cloudflare.com; style-src 'self' https://cdnjs.cloudflare.com; img-src 'self';"
    );
    next();
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение маршрутов
app.use('/vacancies', vacanciesRoutes);
app.use('/register', registerRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

