const User = require('../models/user.model.js');

module.exports.createUser = async (userData) => {
    try {
        // Destructure data from userData (not req.body)
        const { email, fullname, password } = userData;

        // Check if required fields are present
        if (!email || !fullname.firstname || !fullname.lastname || !password) {
            throw new Error('Please fill all the fields');
        }

        // Create a new user instance
        const newUser = new User({
            email,
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            password
        });

        // Save the new user to the database
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Pass the error to the calling function
    }
};
