
const userService = require('../services/users.service')
const logger = require('../logger/logger').logger
const response = require('../utils/response')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require("dotenv").config();


class Login {

    async auth(req, res) {
        const { username, password } = req.body
        const result = await userService.getUsers();
        // console.log(result)

        if (result.status == 200) {
            if (username != result.username) {
                return res.status(404).json({ "message": "user not found" })
            }

            const ismatch = bcrypt.compare(password, result.password);
            if (!ismatch) {
                return res.status(401).json({ "message": "invalid Password" })
            }

            const token = jwt.sign(
                { 'username': username },
                process.env.JWT_TOKEN,
                { expiresIn: '1h' }
            )
            logger.log("User List Fetched Successfull !!!", "N/A", "info");
            response.Success(res, "user list", result)
        }
        else {
            logger.log("Error Fetching List !!!", "N/A", "info");
            response.Error(res, result)
        }

        res.json({ token });

    }

}

module.exports = new Login();