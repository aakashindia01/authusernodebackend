const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('./logger')

class Utils {
    static generateJwtToken(user){
        return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }

    static async hashPassword(password){
        try {
            const saltRounds = 10;
            return await bcrypt.hash(password, saltRounds);
        } catch (error) {
            logger.error(error);
            throw error; // Throw the error to handle it in the calling code
        }
    } 

    static async comparePassword(password, hashedPassword){
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            logger.error(error);
            throw error; // Throw the error to handle it in the calling code
        }
    }

    static verifyToken(token){
        try {
            return jwt.verify(token, process.env.JWT_SECRET); // Pass the secret key for verification
        } catch(error){
            logger.error(error);
            throw error; // Throw the error to handle it in the calling code
        }
    }
}

module.exports = Utils;
