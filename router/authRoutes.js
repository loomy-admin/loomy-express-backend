const express = require("express");
const authHandler = require("../handlers/authHandler");
const router = express.Router();

/**
 * @swagger
 * /v1/api/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - userName
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
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
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Bad Request - Email/Username exists or Passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: EMAIL_ALREADY_EXISTS
 *       500:
 *         description: Internal server error while registering the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post("/signup", userSignip);
function userSignip(req, res) {
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
 *         description: You are successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: You are successfully logged in
 */
router.post("/signin", (req, res) => {
  return res.status(200).json("You are successfully logged in");
});

module.exports = router;
