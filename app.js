const express = require('express');
const path = require('path');

const candidateRoutes = require('./routes/candidates');
const employerRoutes = require('./routes/employers');
const vacanciesRoutes = require('./routes/vacancies')

const app = express();
const PORT = 8000;

// Указываем папку public для статических файлов
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));  // Установка папки для шаблонов
app.set('view engine', 'ejs');  // Установка движка шаблонов

app.use(express.json());

// Подключение маршрутов
app.use('/vacancies', vacanciesRoutes);
app.use('/candidates', candidateRoutes);
app.use('/employers', employerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

