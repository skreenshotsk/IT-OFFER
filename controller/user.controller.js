const db = require('../bd')

class UserController {
    async createUser(req, res) {
        const {position_code, name, salary} = req.body
        const newPerson = await db.query('INSERT INTO positions (position_code, name, salary) values ($1, $2, $3) RETURNING *', [position_code, name, salary])
        console.log(position_code, name, salary)
        res.json(newPerson.rows[0])
    }
}


module.exports = new UserController()