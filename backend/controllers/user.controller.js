const user= require('../models/user.model.js');
const userService=require('../services/user.service.js');
const {validationResult} = require('express-validator');
const BlacklistToken = require('../models/blacklistToken.model.js');

module.exports.registerUser = async (req, res,next) => {
    console.log('Request Body:', req.body); // ✅ Check what you are receiving

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const {fullname, email, password} = req.body;
    const { firstname, lastname } = fullname // Ensure this is processed as JSON
    const isuserexist=await user.findOne({email});
    if(isuserexist){
        return res.status(409).json({error:'User already exists'});
    }

    const newUserInstance = new user({ email, fullname: { firstname, lastname }, password });
    const hashPassword = await newUserInstance.hashPassword(password); // Hash the password before saving


    const newUser = await userService.createUser({
        email,
        fullname:{
            firstname:fullname.firstname,
            lastname:fullname.lastname
        },
        password:hashPassword
    });

    const token = await newUser.generateAuthToken();
    res.status(201).json({token, newUser}); // Return the token and new user details
}

module.exports.loginUser=async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const userInstance = await user.findOne({email}).select('+password');
        if (!userInstance) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isMatch = await userInstance.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = await userInstance.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(200).json({token, userInstance});

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports.getUserProfile=async (req, res) => {
    res.status(200).json({user:req.user});
    // The user is already attached to the request object by the auth middleware

}

module.exports.logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        // Blacklist the token
        await BlacklistToken.create({ token });

        // Clear the cookie (if using cookies)
        res.clearCookie('token');

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
