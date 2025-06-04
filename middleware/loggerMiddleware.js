const logger = require("../connectors/logger");

const requestResponseLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;

        logger.info(
            `${req.ip} - "${req.method} ${req.originalUrl} ${req.protocol.toUpperCase()}/${req.httpVersion}" ${res.statusCode} ${res.statusMessage} - ${duration}ms`
        );
    });
    next();
};

module.exports = requestResponseLogger;
