const blacklistTokenModel = require('../models/blacklistToken.model');
const Driver = require('../models/driver.model');
const driverService = require('../services/driver.service');
const { validationResult } = require('express-validator');

module.exports.registerDriver = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;
    const { firstname, lastname } = fullname;
    
    const isDriverAlreadyExist = await Driver.findOne({ email });
    if (isDriverAlreadyExist) {
        return res.status(409).json({ error: 'Driver already exists' });
    }

    const hashedPassword = await Driver.hashPassword(password);
    const newDriver = await driverService.createDriver({
        email,
        fullname: { firstname, lastname },
        password: hashedPassword,
        vehicle: {
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        }
    });

    const token = await newDriver.generateAuthToken();
    res.status(201).json({ token, newDriver });
};

module.exports.loginDriver = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    try {
        const driver = await Driver.findOne({ email }).select('+password');
        if (!driver) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await driver.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = await driver.generateAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        
        res.status(200).json({ token, driver });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.getDriverProfile = async (req, res) => {
    res.status(200).json({ driver: req.driver });
};

module.exports.logoutDriver = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        // Blacklist the token if using a blacklist system (implement separately)
        // await BlacklistToken.create({ token });
        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
