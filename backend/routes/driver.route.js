const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const driverController = require('../controllers/driver.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');


router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate number must be at least 3 characters long'),
    body('vehicle.capacity').isNumeric().withMessage('Capacity must be a number'),
    body('vehicle.vehicleType').isIn(['car', 'auto', 'motorcycle']).withMessage('Vehicle type must be either car, auto, or motorcycle'),
], 
   driverController.registerDriver
);
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], 
   driverController.loginDriver
);

router.get('/profile', authMiddleware.authDriver, driverController.getDriverProfile);
router.get('/logout', driverController.logoutDriver);








module.exports = router;