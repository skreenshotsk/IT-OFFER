// controllers/userController.js
const userModel = require('../models/userModel');
const candidateModel = require('../models/candidateModel');
const employerModel = require('../models/employerModel');
const bcrypt = require('bcrypt');

// Обработка регистрации пользователя
const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, phone_num, password, user_type, telegram_id, education, experience, portfolio_links, project_description_candidate, company_name, description, website, legal_address, project_photo, company_logo, project_description } = req.body;
        console.log(req.body);
        // Хэширование пароля
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Создание объекта пользователя
        const user = {
            first_name,
            last_name,
            email,
            phone_num,
            password_hash,
            user_type
        };

        // Запись пользователя в базу данных
        const newUser = await userModel.createUser(user);

        // Запись данных в таблицу candidates или employers в зависимости от роли
        if (user_type === 'candidate') {
            const candidate = {
                user_id: newUser.user_id,
                phone: phone_num,
                telegram_id,
                education,
                experience,
                portfolio_links,
                project_description_candidate
            };
            await candidateModel.createCandidate(candidate);
        } else if (user_type === 'employer') {
            console.log('123');
            const employer = {
                user_id: newUser.user_id,
                company_name,
                description,
                website,
                legal_address,
                project_photo,
                company_logo,
                project_description
            };
            console.log('Employer data uc:', employer);
            await employerModel.createEmployer(employer);
        }

        // Возвращение успешного ответа в формате JSON
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Error during registration:', error); // Логирование ошибки
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
};

//сделать заполнение навыков (таблицы скиллс для кд и рд), и пополнить инит скл
//для работы бэка убирать html из ссылки (позже исправить)
//для запуска бд очистка: docker-compose down -v запуск бд: docker-compose up -d
//запуск сервера node app.js