const logger = require('../utils/logger');

const requestResponseLogger = (req, res, next) => {
    logger.info(`Incoming Request ${req.method} ${req.url}`);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`Outgoing Response ${req.method} ${req.url} - ${res.statusCode} ${duration}ms`);
    });

    next();
};

module.exports = requestResponseLogger;