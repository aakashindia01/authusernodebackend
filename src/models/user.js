const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        uniqe:true
    },
    password:{
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        required: false
    },
    googleId:{
        type: String,
        required: false
    },
    profilePhoto:{
        type: String,
        required: false
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;