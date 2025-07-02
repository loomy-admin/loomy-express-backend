const moment = require('moment');
const logger = require('../connectors/logger');
const usersRepo = require('../repository/usersRepository');

exports.incrementBirthdayAges = async () => {
  logger.info("🔁 Birthday Age Updater START");

  try {
    const today = moment().format('MM-DD');

    // 1. Fetch all users with valid DOB
    const allUsers = await usersRepo.getUsersWithDOB();

    // 2. Filter users with birthday today
    const usersWithBirthdayToday = allUsers.filter(user =>
      moment(user.dob).format('MM-DD') === today
    );

    if (usersWithBirthdayToday.length === 0) {
      logger.info("🎉 No birthdays today.");
      return;
    }

    logger.info(`🎂 Found ${usersWithBirthdayToday.length} user(s) with birthdays today.`);

    // 3. Update age for each birthday user
    for (const user of usersWithBirthdayToday) {
      const newAge = moment().diff(moment(user.dob), 'years');

      try {
        await usersRepo.updateUserAgeByEmail(user.email, newAge);
        logger.info(`✅ Updated age for ${user.email} to ${newAge}`);
      } catch (err) {
        logger.error(`⚠️ Failed to update age for ${user.email}:`, err);
      }
    }

    logger.info("🎯 Birthday Age Updater COMPLETE");

  } catch (error) {
    logger.error("❌ Error in incrementBirthdayAges:", error);
  }
};
