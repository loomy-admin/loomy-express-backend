const { getUserDetails, updateUserByEmail } = require('../repository/usersRepository');

/**
 * Updates the user's streak based on last_active_date.
 * Increments streak if last_active_date is yesterday, resets to 1 if missed, does nothing if already today.
 * @param {string} email - User's email
 */
exports.updateUserStreak = async (email) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const user = await getUserDetails(email);
  if (!user) throw new Error('User not found');

  let newStreak = 1;
  if (user.last_active_date === todayStr) {
    // Already updated today, do nothing
    return user.streak;
  } else if (user.last_active_date === yesterdayStr) {
    newStreak = (user.streak || 0) + 1;
  }
  // else: missed a day or never set, reset to 1

  await updateUserByEmail(email, {
    streak: newStreak,
    last_active_date: todayStr,
  });
  return newStreak;
}; 