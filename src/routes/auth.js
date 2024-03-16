const express = require('express');
const { login, register, getUser, deleteUser, home, redirect } = require('../controllers/auth');
const {verifyToken, requireAdmin} = require('../middleware/validation');
const passport = require('passport');
const router = express.Router();

router.get('/home',verifyToken, home)
router.post('/login', login);
router.post('/register', register);
router.get('/getDetails', verifyToken, getUser);
router.delete('/deleteUser',verifyToken, requireAdmin, deleteUser );

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/api/auth/login',
    successRedirect: '/api/auth/home'
}));

module.exports = router;