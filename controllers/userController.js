const userModel = require('../models/userModel');
const candidateModel = require('../models/candidateModel');
const employerModel = require('../models/employerModel');
const candidateSkillModel = require('../models/candidateSkillModel');
const bcrypt = require('bcrypt');

// Обработка регистрации пользователя
const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, phone_num, password, user_type, telegram_id, education, experience, skills, portfolio_links, project_description_candidate, company_name, description, website, legal_address, project_photo, company_logo, project_description } = req.body;
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
            const newCandidate = await candidateModel.createCandidate(candidate);
            //await candidateModel.createCandidate(candidate);//*
            // Запись выбранных навыков в таблицу candidate_skills
            // Приведение переменной skills к массиву
            let processedSkills = [];
            if (typeof skills === 'string') {                                          //изменено
                // Если skills — это строка, преобразуем в массив чисел
                processedSkills = skills.split(',').map(skill => parseInt(skill.trim(), 10)).filter(skill => !isNaN(skill));
            } else if (Array.isArray(skills)) {
                // Если это массив, убедимся, что все элементы — числа
                processedSkills = skills.map(skill => parseInt(skill, 10)).filter(skill => !isNaN(skill));
            }
            console.log('Навыки для вставки:', processedSkills);
            if (processedSkills.length > 0) {
                try {
                    // Используем Promise.all для одновременной обработки всех навыков
                    await Promise.all(
                        processedSkills.map(async (skillId) => {
                            await candidateSkillModel.addSkillToCandidate(newCandidate.candidate_id, skillId);
                            console.log(`Успешно добавлен навык: ${skillId}`);
                        })
                    );
                } catch (error) {
                    console.error('Ошибка при добавлении навыков:', error);
                }
            } else {
                console.error('Навыки отсутствуют или имеют некорректный формат:', skills);
            }
            

            
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