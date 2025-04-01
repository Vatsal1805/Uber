const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const driverSchema = new mongoose.Schema({
    fullname:{
        firstname: { type: String, required: true,minlength: [3,'First name must be at least 3 characters long'] },
        lastname: { type: String, required: true }
    },
    email:{
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
        match: [/^.+@.+\..+$/, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required: true,
        select: false,
        //minlength: [6,'Password must be at least 6 characters long']
    },
    socketid: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    vehicle: {
        color:{
            type: String,
            required: true,
            minlength: [3,'Color must be at least 3 characters long']
        },
        plate:{
            type: String,
            required: true,
            minlength: [3,'Plate number must be at least 3 characters long'],
           
        },
        capacity:{
            type: Number,
            required: true,
            min: [1,'Capacity must be at least 1']
        },
        vehicleType:{
            type: String,
            required: true,
            enum: ['car', 'auto', 'motorcycle'],
            
        }
    },
    location:{
        lat:{
            type: Number,
            
        },
        lng:{
            type: Number,
            
        }
    }
})


driverSchema.methods.generateAuthToken = async function () {
   
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}
driverSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}
driverSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const Driver= mongoose.model('Driver', driverSchema);
module.exports = Driver;