const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authHandler = require("../handlers/authHandler");
const jwtVerifier = require("../middleware/jwtVerifier");
const router = express.Router();

/**
 * @swagger
 * /v1/api/auth/signupWithSupabase:
 *   post:
 *     summary: Sign up or log in a user with Supabase
 *     description: >
 *       This endpoint allows users to sign up or log in using their email and password via Supabase.
 *       - If the user does not exist, it creates an account and logs them in automatically.
 *       - If the user already exists, it attempts to log them in.
 *     tags: [Auth Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: User registered successfully and auto-logged in (sign-up)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: USER_REGISTERED_SUCCESSFULLY
 *                 type:
 *                   type: string
 *                   example: signup-login
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *                 refreshToken:
 *                   type: string
 *                   example: lsdghfa8273hfklasdhf823...
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     id:
 *                       type: string
 *                       example: ceaf3cac-2100-4d9f-ae00-9b721316c36c
 *                     role:
 *                       type: string
 *                       example: USER
 *                 profileComplete:
 *                   type: boolean
 *                   example: false
 *       200:
 *         description: User logged in successfully (sign-in)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: USER_LOGGED_IN_SUCCESSFULLY
 *                 type:
 *                   type: string
 *                   example: signin
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *                 refreshToken:
 *                   type: string
 *                   example: lsdghfa8273hfklasdhf823...
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     id:
 *                       type: string
 *                       example: ceaf3cac-2100-4d9f-ae00-9b721316c36c
 *                     role:
 *                       type: string
 *                       example: USER
 *                 profileComplete:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad Request - Invalid credentials or signup/login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: INTERNAL_SERVER_ERROR
 */
router.post("/signupWithSupabase", userSignup);
function userSignup(req, res) {
  return authHandler.userSignupHandler(req, res);
}

/**
 * @swagger
 * /v1/api/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
router.post("/signin", signin);
function signin(req,res) {
  return authHandler.userSigninHandler(req, res);
};

/**
 * @swagger
 * /v1/api/auth/googleSignin:
 *   post:
 *     summary: Sign in or register a user using Google OAuth
 *     tags: [Auth Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - access_token
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: Google OAuth access token
 *                 example: "ya29.a0AfH6SM..."
 *               full_name:
 *                 type: string
 *                 description: Full name of the user (optional, falls back to Google name)
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google and custom JWT issued
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly refresh token cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 token:
 *                   type: string
 *                   description: JWT access token (8h expiry)
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     role:
 *                       type: string
 *                       example: "USER"
 *                 profileComplete:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Google access_token required
 *       401:
 *         description: Invalid Google access_token
 *       500:
 *         description: Internal Server Error
 */
router.post("/googleSignin", googleSigninA);
function googleSigninA(req, res) {
  return authHandler.googleSigninAuthHandler(req, res);
};

router.post("/onBoarding", jwtVerifier, onBoarding);
function onBoarding(req, res) {
  return authHandler.onBoardingHandler(req, res);
}

// authController.js or routes.js
router.post("/refresh", async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: "No refresh token found" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await getUserDetails(payload.email);
    if (!user || !user.is_active) {
      return res.status(403).json({ error: "Invalid refresh token user" });
    }

    // ✅ Step 1: Generate new access token
    const newAccessToken = jwt.sign(
      {
        email: payload.email,
        role: payload.role,
        provider: payload.provider,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ Step 2: Generate new refresh token
    const newRefreshToken = jwt.sign(
      {
        email: payload.email,
        role: payload.role,
        provider: payload.provider,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Step 3: Set the new refresh token as a cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Step 4: Send access token back
    return res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    console.error("Refresh failed:", error);
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

/**
 * @swagger
 * /v1/api/auth/user/{email}:
 *   get:
 *     summary: Get user details by email
 *     tags: [Auth Routes]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address of the user
 *         example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User details retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     user_name:
 *                       type: string
 *                       example: "johndoe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     role:
 *                       type: string
 *                       example: "USER"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid email format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email format"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/user/:email", getUserByEmail);
function getUserByEmail(req, res) {
  return authHandler.getUserByEmailHandler(req, res);
}

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Logged out" });
});


// router.post("/googleAuth", googleSignin);
// function googleSignin(req, res) {
//   return authHandler.googleSigninHandler(req, res);
// };

module.exports = router;
