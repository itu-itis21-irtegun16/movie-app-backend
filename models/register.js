const mongoose = require('mongoose');

const Schema = mongoose.Schema

const register = new Schema({
    firstname: String,
    lastname: String,
    email: {
        unique: true,
        type: String
    },
    password: String,
    gender: String,
    birthday: Date,
    wight: Number,
    tall: Number,
    favoriteList: [
    ]

}, {timestamps: true})

const Register = mongoose.model('Register', register)
module.exports = Register