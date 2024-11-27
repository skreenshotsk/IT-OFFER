const userModel = require('../models/userModel');
const candidateModel = require('../models/candidateModel');

const adminPanel = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        const candidates = await candidateModel.getAllCandidates();
        // Fetch data from other models
        res.render('admin', { users, candidates });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    adminPanel,
};