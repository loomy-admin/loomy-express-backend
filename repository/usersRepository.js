const connectToSupabase = require('../connectors/connectToSupabase');
const logger = require('../connectors/logger');

const supabase = connectToSupabase();

// Supabase Sign-up with Email
exports.signupWithEmail = async (email, password) => {
  try {
    logger.info("usersRepository.signupWithEmail START");

    const { data, error } = await supabase.auth.signUp({ email, password, provider: 'email' });

    if (error) {
      logger.error("Supabase signup error:", error.message);
      throw new Error(error.message);
    }

    logger.info("usersRepository.signupWithEmail STOP");
    return data;
  } catch (error) {
    logger.error("Error in signupWithEmail:", error);
    throw error;
  }
}

exports.signInWithEmail = async (email, password) => {
  logger.info("usersRepository.signInWithEmail START");

  const { data: session, error } = await supabase.auth.signInWithPassword({ email: email, password: password });

  if (error) {
    logger.error("Supabase signin error:", error);
    throw new Error(error.message);
  }

  logger.info("usersRepository.signInWithEmail STOP");
  return { session, user: session.user };
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
      .maybeSingle(); // single() automatically unwraps the result

    if (error) throw error;

    return data;
  } catch (error) {
    logger.error('Error:', error);
    throw error;
  } finally {
    logger.info('usersRepository.getUserDetails STOP');
  }
};

exports.signinWithGoogleAuth = async (id_token) => {
  logger.info("usersRepository.signinWithGoogleAuth START");
  try {
    const { data, error } = await supabase.auth.admin.signInWithIdToken({
      provider: 'google',
      token: id_token,
    });
    if (error) {
      logger.error("Supabase signin error:", error);
      throw new Error(error.message);
    }
    logger.info("usersRepository.signinWithGoogleAuth STOP");
    return { data, error };
  }
  catch (error) {
    logger.error("Error in signinWithGoogleAuth:", error);
    throw error;
  }
}


exports.updateUserByEmail = async (email, userData) => {
  logger.info("usersRepository.updateUserByEmail START");

  try {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('email', email)
      .select(); // Optional: return updated data

    if (error) throw error;

    logger.info("usersRepository.updateUserByEmail STOP");
    return data[0];
  } catch (error) {
    logger.error("Error in updateUserByEmail:", error);
    throw error;
  }
};

exports.signinWithGoogleAccessToken = async (access_token) => {
  logger.info("usersRepository.signinWithGoogleAccessToken START");
  try {
    const { data, error } = await supabase.auth.admin.signInWithIdToken({
      provider: 'google',
      token: access_token,
    });

    if (error) {
      logger.error("Supabase Google sign-in error:", error.message);
      throw new Error(error.message);
    }

    logger.info("usersRepository.signinWithGoogleAccessToken STOP");
    return { session: data.session, user: data.user };
  } catch (error) {
    logger.error("Error in signinWithGoogleAccessToken:", error);
    throw error;
  }
};

// ✅ Fetch users with DOB not null
exports.getUsersWithDOB = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .filter('dob', 'neq', null);

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error in getUsersWithDOB:", error);
    throw error;
  }
};

// ✅ Update user's age by email
exports.updateUserAgeByEmail = async (email, newAge) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ age: newAge })
      .eq('email', email)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    logger.error(`Error in updateUserAgeByEmail (${email}):`, error);
    throw error;
  }
};
