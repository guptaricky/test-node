const jwt = require('jsonwebtoken');

const jwtauthenticate = (req,res,next) => {
    const token = req.header('Authorization').split(" ")[1];

    if(!token){
        return res.json({"message":"token is absent"})
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded // Attach decoded payload to req.user
        next();
    } catch (error) {
        return res.status(401).json({"message":"Invalid Token"})
    }


}

module.exports = jwtauthenticate
