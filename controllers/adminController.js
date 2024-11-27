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

module.exports = {
    adminPanel,
};