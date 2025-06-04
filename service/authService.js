const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const logger = require("../connectors/logger");
const { generateTimeStamp } = require("../util/dateAndTimeUtil");
const { insertUser, checkUserExistence } = require("../repository/usersRepository");
const Users = require("../models/Users");
const { USER_REGISTERED_SUCCESSFULLY } = require("../constants/general");
const { EMAIL_ALREADY_EXISTS, USERNAME_ALREADY_EXISTS, PASSWORDS_DO_NOT_MATCH } = require("../constants/errorConstants");


exports.userSignupService = async (req, res) => {
    try {
        logger.info("authService.userSignupService START");
        const userFields = Object.keys(Users.schema.paths); 
        const userData = Object.fromEntries(
            Object.entries(req.body).filter(([key]) => userFields.includes(key))
        );

        const { emailExists, usernameExists } = await checkUserExistence(userData.email, userData.userName);

        if (emailExists) {
            logger.info("authService.userSignupService - EMAIL ALREADY EXISTS STOP");
            return res.status(400).json({ error: EMAIL_ALREADY_EXISTS });
        }

        if (usernameExists) {
            logger.info("authService.userSignupService - USERNAME ALREADY EXISTS STOP");
            return res.status(400).json({ error: USERNAME_ALREADY_EXISTS });
        }

        if (userData.password !== userData.confirmPassword) {
            logger.info("authService.userSignupService - PASSWORDS DO NOT MATCH STOP");
            return res.status(400).json({ error: PASSWORDS_DO_NOT_MATCH });
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        userData.confirmPassword = hashedPassword;

        userData.createdAt = generateTimeStamp();
        userData.updatedAt = generateTimeStamp();
        userData.isActive = true;

        await insertUser(userData);
        logger.info("authService.userSignupService STOP");
        return res.status(201).json({
            message: USER_REGISTERED_SUCCESSFULLY,
        });
    }
    catch (error) {
        logger.error("Error in userSignupService:", error);
        return res.status(500).json({ error: error });
    }
}