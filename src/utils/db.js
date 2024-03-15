const mongoose = require('mongoose');
const logger = require('./logger')

const connectDb = async (next) => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        logger.info("Connected to MongoDB")
        next();
    } catch (error) {
        logger.error('MongoDB connection error:', error);
    }
}

module.exports = connectDb;