const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    role: {
        type: String,
        enum: ["USER", "ADMIN"], 
        required: true,          
        default: "USER"          
    },
    createdAt: { type: String },
    updatedAt: { type: String },
    isActive: { type: Boolean, default: false }
});

const Users = mongoose.model('users', userSchema);

module.exports = Users;
