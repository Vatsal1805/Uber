const Driver = require('../models/driver.model.js');

module.exports.createDriver = async (driverData) => {
    try {
        // Destructure data from driverData (not req.body)
        const { email, fullname, password, vehicle } = driverData;

        // Check if required fields are present
        if (!email || !fullname.firstname || !fullname.lastname || !password || !vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType) {
            throw new Error('Please fill all the fields');
        }

        // Create a new driver instance
        const newDriver = new Driver({
            email,
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            password,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType
            }
        });

        // Save the new driver to the database
        await newDriver.save();
        return newDriver;
    } catch (error) {
        console.error('Error creating driver:', error);
        throw error; // Pass the error to the calling function
    }
};
