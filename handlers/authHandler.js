const { generateTimeStamp } = require("../util/dateAndTimeUtil");
const logger = require("../connectors/logger");
const { USER_SIGNUP, USER_SIGNIN, USER_SIGIN_WITH_GOOGLE, USER_ONBOARDING } = require("../constants/eventConstants");
const { insertEvent } = require("../repository/eventRepository");
const authService = require("../service/authService");
const { FAILED_TO_HANDLE_USER_SIGNUP, FAILED_TO_HANDLE_USER_SIGNIN } = require("../constants/errorConstants");
const { GET_USER_BY_EMAIL } = require("../constants/eventConstants");
const { FAILED_TO_HANDLE_GET_USER_BY_EMAIL } = require("../constants/errorConstants");
const { FAILED_TO_HANDLE_USER_SIGNUP, FAILED_TO_HANDLE_USER_SIGNIN, FAILED_TO_HANDLE_USER_SIGNIN_WITH_GOOGLE, FAILED_TO_HANDLE_USER_ONBOARDING } = require("../constants/errorConstants");

exports.userSignupHandler = async (req, res) => {
    logger.info("authHandler.userSignupHandler START");
    try {
        const event = {
            eventType: USER_SIGNUP,
            email: req.body.email,
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
            email: req.body.email,
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

exports.getUserByEmailHandler = async (req, res) => {
  logger.info("authHandler.getUserByEmailHandler START");
  try {
    const event = {
      eventType: GET_USER_BY_EMAIL,
      email: req.params.email,
      URL: req.url,
      ipAddress: [req.ip],
      httpMethod: req.method,
      requestPayload: JSON.stringify(req.params),
      createdAt: generateTimeStamp(),
    };
    await insertEvent(event);
    return authService.getUserByEmailService(req, res);
  } catch (error) {
    logger.error("Error in getUserByEmailHandler:", error);
    return res.status(500).json({ error: FAILED_TO_HANDLE_GET_USER_BY_EMAIL });
  } finally {
    logger.info("authHandler.getUserByEmailHandler STOP");
  }
};

exports.googleSigninAuthHandler = async (req, res) => {
    logger.info("authHandler.googleSigninAuthHandler START");
    try {
        const event = {
            eventType: USER_SIGIN_WITH_GOOGLE,
            email: req.body.email,
            URL: req.url,
            ipAddress: [req.ip],
            httpMethod: req.method,
            requestPayload: JSON.stringify(req.body),
            createdAt: generateTimeStamp(),
        };
        await insertEvent(event);
        return authService.googleSigninService(req, res);
    }
    catch(error) {
        logger.error("Error in googleSigninAuthHandler:", error);
        return res.status(500).json({ error: FAILED_TO_HANDLE_USER_SIGNIN_WITH_GOOGLE });
    }
    finally {
        logger.info("authHandler.googleSigninAuthHandler STOP");
    }
}

exports.onBoardingHandler = async (req, res) => {
    logger.info("authHandler.onBoardingHandler START");
    try {
        const email = req.user.email;
        const event = {
            eventType: USER_ONBOARDING,
            email: email,
            URL: req.url,
            ipAddress: [req.ip],
            httpMethod: req.method,
            requestPayload: JSON.stringify(req.body),
            createdAt: generateTimeStamp(),
        }
        await insertEvent(event);
        return authService.onBoardingService(req, res);
    }
    catch(error) {
        logger.error("Error in onBoardingHandler:", error);
        return res.status(500).json({ error: FAILED_TO_HANDLE_USER_ONBOARDING });
    }
    finally {
        logger.info("authHandler.onBoardingHandler STOP");
    }
}

// exports.googleSigninHandler = async (req,res) => {
//     logger.info("authHandler.googleSigninHandler START");
//     try {
//         const event = {
//             eventType: USER_SIGIN_WITH_GOOGLE,
//             eamil: req.body.profile.email,
//             URL: req.url,
//             ipAddress: [req.ip],
//             httpMethod: req.method,
//             requestPayload: JSON.stringify(req.body),
//             createdAt: generateTimeStamp(),
//         };
//         await insertEvent(event);
//         return authService.googleSigninService(req, res);
//     }
//     catch(error) {
//         logger.error("Error in googleSigninHandler:", error);
//         return res.status(500).json({ error: FAILED_TO_HANDLE_USER_SIGNIN_WITH_GOOGLE });
//     }
//     finally {
//         logger.info("authHandler.googleSigninHandler STOP");
//     }
// }
