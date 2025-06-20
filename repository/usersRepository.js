const connectToSupabase = require('../connectors/connectToSupabase');
const logger = require('../connectors/logger');

const supabase = connectToSupabase();


exports.checkUserExistence = async (email, username) => {
  try {
    logger.info("usersRepository.checkUserExistence START");

    const [{ data: emailData }, { data: usernameData }] = await Promise.all([
      supabase.from('users').select('id').eq('email', email).limit(1),
      supabase.from('users').select('id').eq('user_name', username).limit(1)
    ]);

    const emailExists = emailData.length > 0;
    const usernameExists = usernameData.length > 0;

    logger.info("usersRepository.checkUserExistence STOP");

    return { emailExists, usernameExists };
  } catch (error) {
    logger.error("Error in checkUserExistence:", error);
    throw new Error("Failed to check user existence");
  }
};


// Insert a new user
exports.insertUser = async (userData) => {
  try {
    logger.info("usersRepository.insertUser START");

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select(); // to return inserted data

    if (error) throw error;

    logger.info("usersRepository.insertUser STOP");
    return data[0];
  } catch (error) {
    logger.error("Error in insertUser:", error);
    throw error;
  }
};


// Get user by email
exports.getUserDetails = async (email) => {
  try {
    logger.info('usersRepository.getUserDetails START');

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1)
      .single(); // single() automatically unwraps the result

    if (error) throw error;

    return data;
  } catch (error) {
    logger.error('Error:', error);
    throw error;
  } finally {
    logger.info('usersRepository.getUserDetails STOP');
  }
};


// Get user by username
exports.getUserDetailsUsername = async (userName) => {
  try {
    logger.info('usersRepository.getUserDetailsUsername START');

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_name', userName)
      .limit(1)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    logger.error('Error:', error);
    throw error;
  } finally {
    logger.info('usersRepository.getUserDetailsUsername STOP');
  }
};
