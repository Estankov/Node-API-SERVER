const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please add a name']
    },
    email: {
        type: String,
        require: [true, 'Please add an email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        require: [true,'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resertPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT return
UserSchema.methods.getSignedJwtToken = function(){
     return jwt.sign({ id:this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
     })
}

module.exports = mongoose.model('User', UserSchema);