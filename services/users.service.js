const sequelize = require('../config/dbConnection');
const { Sequelize } = require('sequelize');

const userModel = require('../Models/user.model')

const logger = require("../logger/logger").logger;


const getUsers = async () => {
    try {
        const users = await userModel.findAll();
        return { users };
    } catch (error) {
        logger.log(error.message,'N/A','info')
        return errorMsg = error.message
    }
}


module.exports = { getUsers }
