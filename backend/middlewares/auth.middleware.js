const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const BlacklistToken = require('../models/blacklistToken.model.js');
const Driver = require('../models/driver.model.js'); // Assuming you have a Driver model
module.exports.authUser = async (req, res, next) => {
    try {
        // Extract token from cookies or authorization header
        const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Check if the token is blacklisted
        const isBlacklisted = await BlacklistToken.exists({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userInstance = await User.findById(decoded._id);
        if (!userInstance) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // Attach user instance to request
        req.user = userInstance;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports.authDriver = async (req, res, next) => {
    try{
        const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1]);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        const isBlacklisted = await BlacklistToken.exists({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const driverInstance = await Driver.findById(decoded._id);
        if (!driverInstance) {
            return res.status(401).json({ message: 'Unauthorized: Driver not found' });
        }
        req.driver = driverInstance;
        next();

    }catch(error){
        console.error('Auth Middleware Error:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
}