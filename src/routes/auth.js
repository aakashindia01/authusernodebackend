const express = require('express');
const { login, isloggedin, logout, register, getUser, deleteUser, home } = require('../controllers/auth');
const {verifyToken, requireAdmin, isUserLoggedIn} = require('../middleware/validation');
const passport = require('passport');
const router = express.Router();

router.get('/home',verifyToken, home)
router.post('/login', login);
router.get('/isloggedin', isUserLoggedIn, isloggedin)
router.get('/logout', logout);
router.post('/register', register);
router.get('/getDetails', verifyToken, getUser);
router.delete('/deleteUser',verifyToken, requireAdmin, deleteUser );

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/api/auth/login',
    successRedirect: 'http://localhost:4200/home'
}));

module.exports = router;