const express = require('express');
const { login, register, getUser, deleteUser } = require('../controllers/auth');
const {verifyToken, requireAdmin} = require('../middleware/validation');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/getDetails', verifyToken, getUser);
router.delete('/deleteUser',verifyToken, requireAdmin, deleteUser );

module.exports = router;