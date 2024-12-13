const express = require('express')
const app = express()
const router = express('router')
const userRoutes = require('./user.route')
const loginRoutes = require('./login.route')

app.use('/api/v1',loginRoutes);

app.use('/api/v1',userRoutes)

module.exports = app;