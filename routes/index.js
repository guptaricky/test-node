const express = require('express')
const app = express()
const router = express('router')
const userRoutes = require('./user.route')
const loginRoutes = require('./login.route')
const dashboardRoutes = require('./dashboard.route')

app.use('/api/v1', loginRoutes);

app.use('/api/v1', userRoutes);

app.use('/api/v1', dashboardRoutes);

module.exports = app;