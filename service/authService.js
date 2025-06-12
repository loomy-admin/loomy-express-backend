const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../connectors/logger");
const { generateTimeStamp } = require("../util/dateAndTimeUtil");
const { insertUser, checkUserExistence, getUserDetails, getUserDetailsUsername } = require("../repository/usersRepository");
const Users = require("../models/Users");
const { 
    USER_REGISTERED_SUCCESSFULLY,
    USER_LOGGED_IN_SUCCESSFULLY 
} = require("../constants/general");
const { 
    EMAIL_ALREADY_EXISTS, 
    USERNAME_ALREADY_EXISTS, 
    PASSWORDS_DO_NOT_MATCH, 
    PLEASE_PROVIDE_REQUIRED_FIELDS, 
    USER_NOT_FOUND,
    EMAIL_OR_USERNAME_ERROR,
    INVALID_PASSWORD,
    INTERNAL_SERVER_ERROR
 } = require("../constants/errorConstants");

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
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
}

exports.userSigninService = async (req, res) => {
    try {
        logger.info("authService.userSigninService START");

        const { userName, email, password } = req.body;

        // Validate input fields
        if (!userName && !email) {
            logger.info("authService.userSigninService - USERNAME OR EMAIL NOT PROVIDED STOP");
            return res.status(400).json({ error: PLEASE_PROVIDE_REQUIRED_FIELDS });
        }

        if (!password) {
            logger.info("authService.userSigninService - PASSWORD NOT PROVIDED STOP");
            return res.status(400).json({ error: PLEASE_PROVIDE_REQUIRED_FIELDS });
        }

        let user = null;
        if (email) {
            user = await getUserDetails(email.trim());
        } else if (userName) {
            user = await getUserDetailsUsername(userName.trim());
        }

        if (!user || user.isActive === false) {
            logger.info("authService.userSigninService - USER NOT FOUND OR INACTIVE STOP");
            return res.status(404).json({ error: USER_NOT_FOUND });
        }

        if ((email && email !== user.email) || (userName && userName !== user.userName)) {
            logger.info("authService.userSigninService - EMAIL OR USERNAME ERROR STOP");
            return res.status(401).json({ error: EMAIL_OR_USERNAME_ERROR });
        }        

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.info("authService.userSigninService - PASSWORD INVALID STOP");
            return res.status(401).json({ error: INVALID_PASSWORD });
        }

        const userPayload = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        // Generate JWT token for non-2FA users
        const token = jwt.sign({ email: user.email, userName: user.userName, role: user.role, user: userPayload }, process.env.JWT_SECRET, {
            expiresIn: "8h",
        });

        logger.info("authService.userSigninService STOP");
        return res.status(200).json({
            token: token,
            role: user.role,
            message: USER_LOGGED_IN_SUCCESSFULLY,
        });
    } catch (error) {
        logger.error("Error in userSigninService:", error);
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
}