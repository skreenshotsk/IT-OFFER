const db = require('../bd')

class UserController {
    async createUser(req, res) {
        const {skill_name} = req.body
        const newPerson = await db.query('INSERT INTO skills (skill_name) values ($1) RETURNING *', [skill_name])
        console.log(skill_name)
        res.json(newPerson.rows[0])
    }
}


module.exports = new UserController()