const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../connectors/logger");
const { generateTimeStamp, calculateAgeFromDOB } = require("../util/dateAndTimeUtil");
const { insertUser, getUserDetails, getUserDetailsUsername, signupWithEmail, signInWithEmail, updateUserByEmail, signinWithGoogleAccessToken } = require("../repository/usersRepository");
const {
    USER_REGISTERED_SUCCESSFULLY,
    USER_LOGGED_IN_SUCCESSFULLY,
    USER_PROFILE_UPDATED_SUCCESSFULLY
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
const { validateOnboardingPayload } = require("../util/validateOnBoarding");

exports.userSignupService = async (req, res) => {
    try {
        logger.info("authService.userSignupService START");
        const { email, password } = req.body;

        const user = await getUserDetails(email);
        const timestamp = generateTimeStamp();
        if (!user) {
            // ➤ Sign up flow
            try {
                await signupWithEmail(email, password);
            } catch (supabaseError) {
                logger.error("Supabase signup failed:", supabaseError.message);
                return res.status(400).json({ error: supabaseError.message });
            }

            const userDataToSave = {
                email: email,
                role: "USER",
                created_at: timestamp,
                updated_at: timestamp,
                is_active: true,
                profileComplete: false,
                provider: "Email",
            };

            await insertUser(userDataToSave);
            logger.info("User signed up and added to DB.");
            try {
                const { session, user: supabaseUser, error } = await signInWithEmail(email, password);

                if (error) {
                    logger.error("Auto-login after signup failed:", error.message);
                    return res.status(400).json({ error: "Signup succeeded, but auto-login failed" });
                }

                return res.status(201).json({
                    message: USER_REGISTERED_SUCCESSFULLY,
                    type: "signup-login",
                    token: session?.session?.access_token,
                    refreshToken: session?.session?.refresh_token,
                    user: {
                        email: supabaseUser.email,
                        id: supabaseUser.id,
                        role: userDataToSave.role,
                    },
                    profileComplete: false,
                });
            } catch (autoLoginError) {
                logger.error("Exception in auto-login after signup:", autoLoginError.message);
                return res.status(400).json({ error: "Signup succeeded, but auto-login failed" });
            }
        } else {
            try {
                if (user.provider !== 'Email') {
                    return res.status(400).json({
                        error: `This email is registered using ${user.login_provider}. Please continue using ${user.login_provider} login.`,
                    });
                }
                const { session, user: supabaseUser, error } = await signInWithEmail(email, password);

                if (error) {
                    logger.error("Supabase login failed:", error.message);
                    return res.status(400).json({ error: "Invalid credentials" });
                }

                logger.info("User authenticated via Supabase");
                return res.status(200).json({
                    message: USER_LOGGED_IN_SUCCESSFULLY,
                    type: "signin",
                    token: session?.session?.access_token,
                    refreshToken: session?.session?.refresh_token,
                    user: {
                        email: supabaseUser.email,
                        id: supabaseUser.id,
                        role: user.role,
                    },
                    profileComplete: true
                    // profileComplete: user.profileComplete
                });

            } catch (loginError) {
                logger.error("Supabase signin error:", loginError.message);
                return res.status(400).json({ error: "Invalid credentials" });
            }
        }
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

exports.googleSigninService = async (req, res) => {
    try {
        const { access_token, full_name } = req.body;

        if (!access_token) {
            return res.status(400).json({ error: "Google access_token required" });
        }

        // 🔐 Step 1: Get Google User Info
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!userInfoResponse.ok) {
            const errorText = await userInfoResponse.text();
            logger.error("Google user info fetch failed:", errorText);
            return res.status(401).json({ error: "Invalid Google access_token" });
        }

        const googleUser = await userInfoResponse.json();
        const email = googleUser.email;
        const timestamp = generateTimeStamp();

        // 🔍 Step 2: Check custom user table
        let existingUser = await getUserDetails(email);

        const userDataToSave = {
            email,
            full_name: full_name || googleUser.name,
            role: "USER",
            provider: "Google",
            profileComplete: existingUser?.profileComplete ?? false,
            is_active: true,
            updated_at: timestamp,
        };

        // 📝 Step 3: Insert or update user
        if (!existingUser) {
            await insertUser({
                ...userDataToSave,
                created_at: timestamp,
            });
        } else {
            await updateUserByEmail(email, userDataToSave);
        }

        // 🔑 Step 4: Generate your own JWT
        const jwtPayload = {
            email,
            role: userDataToSave.role,
            provider: "Google",
        };

        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "8h" });
        const refreshToken = jwt.sign(jwtPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        // ✅ Step 5: Return JWT + user info
        return res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .status(200)
            .json({
                message: USER_LOGGED_IN_SUCCESSFULLY,
                token: token,
                user: { email, role: userDataToSave.role },
                profileComplete: userDataToSave.profileComplete,
            });
    } catch (error) {
        logger.error("Error in googleSigninService:", error);
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
};

exports.onBoardingService = async (req, res) => {
    try {
        logger.info("authService.onBoardingService START");
        const email = req.user.email;
        const { fullName, dob, grade, board } = req.body;
        const timestamp = generateTimeStamp();
        const age = calculateAgeFromDOB(dob);

        const validationError = validateOnboardingPayload({ dob, grade, board });
        if (validationError) return res.status(400).json({ error: validationError });

        logger.info(email)

        const updatedUser = await updateUserByEmail(email, {
            full_name: fullName,
            dob,
            grade,
            board,
            age,
            updated_at: timestamp,
            profileComplete: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ error: USER_NOT_FOUND });
        }

        logger.info("authService.onBoardingService STOP");
        return res.status(200).json({ message: USER_PROFILE_UPDATED_SUCCESSFULLY });

    }
    catch (error) {
        logger.error("Error in onBoardingService:", error);
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
};


// exports.googleSigninService = async (req, res) => {
//     try {
//         logger.info("authService.googleSigninService START");
//         const { id_token, access_token, profile } = req.body;
//         const timestamp = generateTimeStamp();
//         const email = profile?.email;
//         const full_name = profile?.name;
//         logger.info(req.body);

//         if (!id_token || !email) {
//             return res.status(400).json({ error: "Missing id_token or profile.email" });
//         }

//         const { data, error } = await signinWithGoogleAuth(id_token);


//         if (error) {
//             logger.error("Supabase signin error:", error);
//             return res.status(400).json({ error: error.message });
//         }

//         // 2. Check custom users table
//         const existingUser = await getUserDetails(email);

//         const userDataToSave = {
//             email: profile.email,
//             full_name: profile.name,
//             role: "USER",
//             profileComplete: false,
//             updated_at: timestamp,
//             provider: "Google"
//         };

//         if (existingUser) {
//             if (existingUser.provider !== 'Google') {
//                 logger.warn(`User exists with provider ${existingUser.login_provider}, not Google.`);
//                 return res.status(400).json({
//                     error: `This email is registered using ${existingUser.login_provider}. Please continue using ${existingUser.login_provider} login.`,
//                 });
//             }

//             await updateUserByEmail(email, userDataToSave);
//             logger.info("User profile updated for Google login.");
//         } else {
//             await insertUser({ ...userDataToSave, id: data.user.id, created_at: timestamp });
//             logger.info("User profile created for Google login.");
//         }
//         logger.info("usersRepository.signinWithGoogleAuth STOP");
//         return {
//             access_token: data.session.access_token,
//             refresh_token: data.session.refresh_token,
//             user: {
//                 email: email,
//                 id: data.user.id,
//                 role: "USER",
//             },
//             profileComplete: existingUser?.profileComplete ?? false,
//         };
//     }
//     catch (error) {
//         logger.error("Error in googleSigninService:", error);
//         return res.status(500).json({ error: INTERNAL_SERVER_ERROR });
//     }
// }