const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname : {
        type:String,
        required:true
    },
    email_address : {
        type:String,
        required:true,
        unique:true
    },
    phone: {
        type:Number,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true
    },
    cnf_password : {
        type:String,
        required:true
    }
})

const Register = new mongoose.model("Registration", userSchema)

module.exports = Register;