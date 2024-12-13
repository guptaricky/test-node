const express = require('express')
const router = express.Router()
const userController = require('../Controllers/users.controller')
const loginController = require('../Controllers/login.controller')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/login', authMiddleware, loginController.auth)

module.exports = router;

