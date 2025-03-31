const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname:{
        firstname: {
            type: String,
            required: true,
            minlength:[3, 'First name must be at least 3 characters long']
        },
        lastname: {
            type: String,
            required: true,
            minlength:[3, 'Last name must be at least 3 characters long']
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[6, 'Email must be at least 6 characters long'],
    },
    password:{
        type:String,
        required:true,
        select:false
        //minlength:[6, 'Password must be at least 6 characters long'],
    },
    socketid:{
        type:String
    }
})


userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
}

userSchema.methods.matchPassword = async function (Password) {
    return await bcrypt.compare(Password, this.password);
}

userSchema.methods.hashPassword = async function (Password) {
    return await bcrypt.hash(Password, 10);
}

const User = mongoose.model('User', userSchema);
module.exports = User;