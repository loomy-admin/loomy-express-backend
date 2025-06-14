const { generateTimeStamp } = require("../util/dateAndTimeUtil");
const logger = require("../connectors/logger");
const { USER_SIGNUP, USER_SIGNIN } = require("../constants/eventConstants");
const { insertEvent } = require("../repository/eventRepository");
const authService = require("../service/authService");
const { FAILED_TO_HANDLE_USER_SIGNUP, FAILED_TO_HANDLE_USER_SIGNIN } = require("../constants/errorConstants");

exports.userSignupHandler = async (req, res) => {
    logger.info("authHandler.userSignupHandler START");
    try {
        const event = {
            eventType: USER_SIGNUP,
            userName: req.body.userName,
            URL: req.url,
            ipAddress: [req.ip],
            httpMethod: req.method,
            requestPayload: JSON.stringify(req.body),
            createdAt: generateTimeStamp(),
        };
        await insertEvent(event);
        return authService.userSignupService(req, res);
    }
    catch (error) {
        logger.error("Error in userSignupHanlder:", error);
        return res.status(500).json({ error: FAILED_TO_HANDLE_USER_SIGNUP });
    } finally {
        logger.info("authHandler.userSignupHandler STOP");
    }
}

exports.userSigninHandler = async (req, res) => {
    logger.info("authHandler.userSigninHandler START");
    try {
        const event = {
            eventType: USER_SIGNIN,
            userName: req.body.userName,
            URL: req.url,
            ipAddress: [req.ip],
            httpMethod: req.method,
            requestPayload: JSON.stringify(req.body),
            createdAt: generateTimeStamp(),
        };
        await insertEvent(event);
        return authService.userSigninService(req, res);
    }
    catch(error) {
        logger.error("Error in userSigninHandler:", error);
        return res.status(500).json({ error: FAILED_TO_HANDLE_USER_SIGNIN });
    }
    finally {
        logger.info("authHandler.userSigninHandler STOP");
    }
}