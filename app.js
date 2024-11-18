const express = require('express');
const path = require('path');
const crypto = require('crypto');

const vacanciesRoutes = require('./routes/vacancies');
const registerRoutes = require('./routes/register');

const app = express();
const PORT = 8000;

// Указываем папку public для статических файлов
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));  // Установка папки для шаблонов
app.set('view engine', 'ejs');  // Установка движка шаблонов

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение маршрутов
app.use('/vacancies', vacanciesRoutes);
app.use('/register', registerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

