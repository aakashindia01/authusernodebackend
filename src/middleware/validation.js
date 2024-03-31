const jwt = require('jsonwebtoken');
const Utill = require('../utils/utils');
const User = require('../models/user')
const verifyToken = async (req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (bearerToken && bearerToken.startsWith('Bearer ')) {
        const token = bearerToken.split(' ')[1];
        try {
            const decoded = Utill.verifyToken(token);
            req.user = decoded.user;
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Invalid JWT token' });
        }
    } else {

        if (req.session && req.session.passport) {
            User.findOne({ _id: req.session.passport.user }).then((user) => {
                req.user = user;
                next();
            }).catch((error) => {
                logger.log(error)
                req.user = req.session.passport.user;
                next();
            })
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
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

const isUserLoggedIn = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    try {
        if (bearerToken && bearerToken.startsWith('Bearer ')) {
            const token = bearerToken.split(' ')[1];
            const decoded = Utill.verifyToken(token);
            req.user = decoded.user;
            next();
        } else {
            if (req.isAuthenticated()) {
                next();
            } else {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { verifyToken, requireAdmin, isUserLoggedIn };
