const userService = require('../services/users.service')
const logger = require('../logger/logger').logger
const response = require('../utils/response')
class Users {

    async userList(req, res) {
        logger.log("Getting User List...", "N/A", "info");
        const result = await userService.getUsers();
        // console.log(result)
        if(result.status == 200){
            logger.log("User List Fetched Successfull !!!", "N/A", "info");
            response.Success(res, "user list", result)
        }
        else{
            logger.log("Error Fetching List !!!", "N/A", "info");
            response.Error(res, result)
        }
        
    }

    // async createUser(req,res){

    // }

}

module.exports = new Users();