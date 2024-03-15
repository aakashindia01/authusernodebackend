const jwt = require('jsonwebtoken');
const Utill = require('../utils/utils');

const verifyToken = (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    try {
        const token = bearer.split(' ')[1];
        const decoded = Utill.verifyToken(token);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

const requireAdmin = (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized: Admin privileges required' });
        }
        next();
    } catch (error) {
        res.status(503).json({ message: 'Internal Server Error' });
    }
};

module.exports = { verifyToken, requireAdmin };
