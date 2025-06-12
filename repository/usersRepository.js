const logger = require('../connectors/logger');
const Users = require("../models/Users");

exports.checkUserExistence = async (email, username) => {
    try {
        logger.info("usersRepository.checkUserExistence START");
        const result = await Users.aggregate([
            {
                $match: {
                    $or: [{ email }, { userName: username }],
                },
            },
            {
                $project: {
                    emailExists: { $eq: ["$email", email] },
                    usernameExists: { $eq: ["$userName", username] },
                },
            },
        ]);

        if (result.length === 0) {
            logger.info("usersRepository.checkUserExistence STOP");
            return { emailExists: false, usernameExists: false };
        }
        logger.info("usersRepository.checkUserExistence STOP");
        return result[0]; 
    } catch (error) {
        logger.error("Error in checkUserExistence:", error);
        throw new Error("Failed to check user existence");
    }
};


exports.insertUser = async (userData) => {
    try {
        logger.info("usersRepository.insertUser START");
        const user = new Users(userData);
        logger.info("usersRepository.insertUser STOP");
        return await user.save();
    }
    catch (error) {
        logger.error("Error in insertUser:", error);
    }
}

exports.getUserDetails = async (email) => {
    try {
        logger.info('usersRepository.getUserDetails START');
        return await Users.findOne({ email });
    }
    catch (error) {
        logger.error('Error:', error);
    }
    finally {
        logger.info('usersRepository.getUserDetails STOP');
    }
}

exports.getUserDetailsUsername = async (userName) => {
    try {
        logger.info('usersRepository.getUserDetailsUsername START');
        return await Users.findOne({ userName });
    }
    catch(error) {
        logger.error('Error:', error);
    }
    finally {
        logger.info('usersRepository.getUserDetailsUsername STOP');
    }
}