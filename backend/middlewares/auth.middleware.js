const user = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


module.exports.authUser=async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        if(!token) {return res.status(401).json({message:'Unauthorized'});
        }
        const isblacklisted=await user.findOne({token});
        if(isblacklisted){
            return res.status(401).json({message:'Unauthorized'});
        }
        // Check if the token is blacklisted
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userInstance = await user.findById(decoded._id);
        if (!userInstance) {
            return res.status(401).json({message:'Unauthorized'});
        }
        req.user = userInstance;
        next();
        
    }catch(error){
        return res.status(401).json({message:'Unauthorized'});
    }
}
