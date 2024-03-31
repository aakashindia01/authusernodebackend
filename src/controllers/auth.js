const User = require("../models/user");
const Utill = require("../utils/utils")
const logger = require('../utils/logger')

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }
        const comparePassword = await Utill.comparePassword(password, user.password);
        if(comparePassword){
            const token = Utill.generateJwtToken({...user._doc});
            req.session.token = token;
            return res.status(200).json({ token });
        }
        res.status(401).json({ "message": "Invalid Password" });
        
    } catch (error) {
        logger.error(error);
        res.status(500).json({ "message": "Internal server error" });
    }
}

const isloggedin = async (req, res) => {
    try {
        if (req.user) {
            return res.status(200).json({ "isloggedin": true });
        }
        return res.status(200).json({ "isloggedin": false });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ "message": "Internal server error" });
    }
}

const logout = async (req, res) => {
    res.setHeader('Clear-Site-Data', '"cookies", "storage", "cache"');
    return res.status(200).json({ "msg": "User logout successfully!" });
}

const redirect =async (req, res) => {
    try {
        res.redirect('http://localhost:4200/home');
    } catch (error) {
        logger.error(error);
        res.status(500).json({ "message": "Internal server error" });
    }
}

const register = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;
        const user = await User.findOne({ email })
        if (user) {
            return res.status(404).json({ "message": "User Already Exist!" });
        }
        const token = Utill.generateJwtToken({...req.body});
        const encryptedPassword = await Utill.hashPassword(password);
        const createUser = await User.create({ name, email, password: encryptedPassword, isAdmin })
        res.status(200).json({ "message": "User Registered Successfully!", "data":createUser,  token })
    } catch (error) {
        logger.error(error);
        res.status(500).json({ "message": "Internal server error" });
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id })
        if (!user) {
            return res.status(404).json({ "message": "User Not Found!" });
        }
        return res.status(200).json({ user });
    } catch (error){
        res.status(500).json({ "message": "Internal server error" });
    }
}

const deleteUser = async (req, res) => {
    const userIdsToDelete = req.body.userIds;

    if(!userIdsToDelete || !Array.isArray(userIdsToDelete) || userIdsToDelete.length === 0){
        return res.status(400).json({message: 'User IDs must be provided in the request body as an array'})
    }
    const currentUserId = req.user._id.toString();
    const filteredUserIds = userIdsToDelete.filter((id)=>(id !== currentUserId));
    if (userIdsToDelete.length !== filteredUserIds.length) {
        return res.status(403).json({ message: 'You cannot delete yourself' });
    }
    await User.deleteMany({_id: {$in : userIdsToDelete}})
    res.status(200).json({ message: 'Users deleted successfully' });
}

const home = async (req, res)=> {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) {
            return res.status(404).json({ "message": "User Not Found!" });
        }
        return res.status(200).json({ "msg" : `Welcome To Home : ${user._doc.name}` });
    } catch (error){
        res.status(500).json({ "message": "Internal server error" });
    }
}

module.exports = { login, logout, isloggedin, redirect, home, register, getUser, deleteUser };