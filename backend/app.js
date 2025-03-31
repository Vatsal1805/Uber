const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./dbconfig/db.js');
connectDB();
const app = express();
app.use(cors());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const userRoutes = require('./routes/user.routes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/users', userRoutes);










module.exports = app;