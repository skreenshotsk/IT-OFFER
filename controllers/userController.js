const userModel = require('../models/userModel');
const candidateModel = require('../models/candidateModel');
const employerModel = require('../models/employerModel');
const candidateSkillModel = require('../models/candidateSkillModel');
const resumeModel = require('../models/resumeModel');

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

// Получение данных пользователя и резюме
const getUserResume = async (req, res) => {
    console.log('1: Entering getUserResume');
    try {
        const userId = req.session.userId;
        console.log('2: userId:', userId);

        if (!userId) {
            console.log('3: userId is not set in session');
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const user = await userModel.getUserById(userId);
        console.log('4: user:', user);

        if (!user) {
            console.log('5: User not found');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const candidate = await candidateModel.getCandidateByUserId(userId);
        console.log('6: candidate:', candidate);

        const resume = await resumeModel.getResumeByCandidateId(candidate.candidate_id);
        console.log('7: resume:', resume);

        // Объединяем данные пользователя, кандидата и резюме
        const resumeData = {
            firstName: user.first_name,
            lastName: user.last_name,
            location: resume.location,
            birthDate: resume.birth_date,
            phone: candidate.phone,
            education: candidate.education,
            citizenship: resume.citizenship,
            experience: candidate.experience
        };

        console.log('8: resumeData:', resumeData);

        res.render('add_cv', { resumeData });
    } catch (error) {
        console.error('Error fetching user resume:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Обновление данных пользователя
const updateUserResume = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { first_name, last_name, email, phone_num, user_type, ...additionalData } = req.body;

        // Обновление основных данных пользователя
        const updatedUser = await userModel.updateUser(userId, { first_name, last_name, email, phone_num, user_type });

        // Обновление дополнительных данных в зависимости от типа пользователя
        if (user_type === 'candidate') {
            await candidateModel.updateCandidate(userId, additionalData);
        } else if (user_type === 'employer') {
            await employerModel.updateEmployer(userId, additionalData);
        }

        res.status(200).json({ success: true, message: 'User data updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user resume:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerUser,
    getUserResume,
    updateUserResume,
};

//сделать заполнение навыков (таблицы скиллс для рд), и пополнить инит скл
//для запуска бд очистка: docker-compose down -v запуск бд: docker-compose up -d
//запуск сервера node app.js