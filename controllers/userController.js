const userModel = require('../models/userModel');
const candidateModel = require('../models/candidateModel');
const employerModel = require('../models/employerModel');
const candidateSkillModel = require('../models/candidateSkillModel');
const resumeModel = require('../models/resumeModel');
const vacancyModel = require('../models/vacancyModel');

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

// Создание нового резюме
const createUserResume = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const candidate = await candidateModel.getCandidateByUserId(user.user_id);
        if (!candidate) {
            console.log('Candidate not found for user_id:', user.user_id);
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }

        const resumeData = {
            candidate_id: candidate.candidate_id,
            location: req.body.location,
            birth_date: req.body.birthDate,
            citizenship: req.body.citizenship,
            profession: req.body.profession,
            salary_max: req.body.salary_max,
        };

        const newResume = await resumeModel.createResume(resumeData);
        req.session.hasResume = true;
        res.status(201).json({ success: true, resume: newResume });
    } catch (error) {
        console.error('Error creating user resume:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Получение данных пользователя и резюме
const getUserResume = async (req, res) => {
    try {
        const user = req.user; // Используем req.user из Passport.js
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const candidate = await candidateModel.getCandidateByUserId(user.user_id);
        if (!candidate) {
            console.log('Candidate not found for user_id:', user.user_id);
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }        

        const resume = await resumeModel.getResumeByCandidateId(candidate.candidate_id);

        const resumeData = {
            firstName: user.first_name,
            lastName: user.last_name,
            location: resume ? resume.location : '',
            birthDate: resume ? resume.birth_date : '',
            phone: candidate ? candidate.phone : '',
            education: candidate ? candidate.education : '',
            citizenship: resume ? resume.citizenship : '',
            experience: candidate ? candidate.experience : '',
            profession: resume ? resume.profession: '',
            salary_max: resume ? resume.salary_max: '',
        };

        console.log('5: resumeData:', resumeData);

        res.render('add_cv', { resume: resumeData, user: req.user });
    } catch (error) {
        console.error('Error fetching user resume:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Обновление данных пользователя
const updateUserResume = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const candidate = await candidateModel.getCandidateByUserId(user.user_id);
        if (!candidate) {
            console.log('Candidate not found for user_id:', user.user_id);
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }
        const candidateData = { phone: req.body.phone };
        await candidateModel.updateCandidatePhone(candidate.candidate_id, candidateData);


        const resumeData = {
            candidate_id: candidate.candidate_id,
            location: req.body.location,
            birth_date: req.body.birthDate,
            citizenship: req.body.citizenship,
            profession: req.body.profession,
            salary_max: req.body.salary_max,
        };

        const updatedResume = await resumeModel.updateResume(candidate.candidate_id, resumeData);
        res.status(200).json({ success: true, resume: updatedResume });
    } catch (error) {
        console.error('Error updating user resume:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Создание новой вакансии
const createUserVacancy = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const employer = await employerModel.getEmployerByUserId(user.user_id);
        if (!employer) {
            console.log('Employer not found for user_id:', user.user_id);
            return res.status(404).json({ success: false, message: 'Employer not found' });
        }

        const vacancyData = {
            employer_id: employer.employer_id,
            title: req.body.title,
            description: req.body.description,
            salary: req.body.salary,
            location: req.body.location,
            employment_type: req.body.employmentType
        };

        const newVacancy = await vacancyModel.createVacancy(vacancyData);
        req.session.hasVacancy = true;
        res.status(201).json({ success: true, vacancy: newVacancy });
    } catch (error) {
        console.error('Error creating user vacancy:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserVacancy = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const employer = await employerModel.getEmployerByUserId(user.user_id);
        if (!employer) {
            console.log('Employer not found for user_id:', user.user_id);
            return res.status(404).json({ success: false, message: 'Employer not found' });
        }        

        const vacancy = await vacancyModel.getVacancyByEmployerId(employer.employer_id);

        const vacancyData = {
            title: vacancy ? vacancy.title : '',
            description: vacancy ? vacancy.description : '',
            salary: vacancy ? vacancy.salary : '',
            location: vacancy ? vacancy.location : '',
            employmentType: vacancy ? vacancy.employment_type : ''
        };

        console.log('Vacancy data:', vacancyData);

        res.render('add_vacancy', { vacancy: vacancyData, user: req.user });
    } catch (error) {
        console.error('Error fetching user vacancy:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Получение всех резюме
const getAllResumes = async (req, res) => {
    try {
        const resumes = await resumeModel.getAllResumes();
        res.render('cv', { resumes, user: req.user });
    } catch (error) {
        console.error('Error fetching all resumes:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Получение резюме по ID
const getResumeById = async (req, res) => {
    try {
        const resumeId = req.params.id;
        const resume = await resumeModel.getResumeById(resumeId);
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }
        res.render('cv', { resume, user: req.user });
    } catch (error) {
        console.error('Error fetching resume by ID:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createUserResume,
    registerUser,
    getUserResume,
    updateUserResume,
    createUserVacancy,
    getUserVacancy,
    getAllResumes,
    getResumeById,
};

//сделать заполнение навыков (таблицы скиллс для рд), и пополнить инит скл
//для запуска бд очистка: docker-compose down -v запуск бд: docker-compose up -d
//запуск сервера node app.js

