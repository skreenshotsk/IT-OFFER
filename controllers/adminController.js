const userModel = require('../models/userModel');
const candidateModel = require('../models/candidateModel');
const employerModel = require('../models/employerModel');
const vacancyModel = require('../models/vacancyModel');
const skillModel = require('../models/skillModel');
const candidateSkillsModel = require('../models/skillsCandiModel');
const vacancySkillsModel = require('../models/skillsVacancyModel');
const applicationModel = require('../models/applicationModel');
const resumeModel = require('../models/resumeModel');
const resumeApplicationModel = require('../models/resumeApplicationModel');

const adminPanel = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        const candidates = await candidateModel.getAllCandidates();
        const employers = await employerModel.getAllEmployers();
        const vacancies = await vacancyModel.getAllVacanciesAdmin();
        const skills = await skillModel.getAllSkills();
        const candidateSkills = await candidateSkillsModel.getAllCandidateSkills();
        const vacancySkills = await vacancySkillsModel.getAllVacancySkills();
        const applications = await applicationModel.getAllApplications();
        const resumes = await resumeModel.getAllResumesAdmin();
        const resumeApplications = await resumeApplicationModel.getAllResumeApplications();

        res.render('admin', { users, candidates, employers, vacancies, skills,
            candidateSkills, vacancySkills, applications, resumes, resumeApplications });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Удаление пользователя
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await userModel.deleteUser(userId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting user');
    }
};

// Удаление кандидата
const deleteCandidate = async (req, res) => {
    const candidateId = req.params.id;
    try {
        await candidateModel.deleteCandidate(candidateId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting candidate');
    }
};

// Удаление работодателя
const deleteEmployer = async (req, res) => {
    const employerId = req.params.id;
    try {
        await employerModel.deleteEmployer(employerId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting employer');
    }
};

// Удаление вакансии
const deleteVacancy = async (req, res) => {
    const vacancyId = req.params.id;
    try {
        await vacancyModel.deleteVacancy(vacancyId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting vacancy');
    }
};

// Удаление навыка
const deleteSkill = async (req, res) => {
    const skillId = req.params.id;
    try {
        await skillModel.deleteSkill(skillId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting skill');
    }
};

// Удаление связи кандидата и навыка
const deleteCandidateSkill = async (req, res) => {
    const { candidateId, skillId } = req.params;
    try {
        await candidateSkillsModel.deleteCandidateSkill(candidateId, skillId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting candidate skill');
    }
};

// Удаление связи вакансии и навыка
const deleteVacancySkill = async (req, res) => {
    const { vacancyId, skillId } = req.params;
    try {
        await vacancySkillsModel.deleteVacancySkill(vacancyId, skillId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting vacancy skill');
    }
};

// Удаление заявки
const deleteApplication = async (req, res) => {
    const applicationId = req.params.id;
    try {
        await applicationModel.deleteApplication(applicationId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting application');
    }
};

// Удаление резюме
const deleteResume = async (req, res) => {
    const resumeId = req.params.id;
    try {
        await resumeModel.deleteResume(resumeId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting resume');
    }
};

// Удаление заявки на резюме
const deleteResumeApplication = async (req, res) => {
    const resumeApplicationId = req.params.id;
    try {
        await resumeApplicationModel.deleteResumeApplication(resumeApplicationId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting resume application');
    }
};

module.exports = {
    adminPanel,
    deleteUser,
    deleteCandidate,
    deleteEmployer,
    deleteVacancy,
    deleteSkill,
    deleteCandidateSkill,
    deleteVacancySkill,
    deleteApplication,
    deleteResume,
    deleteResumeApplication,
};