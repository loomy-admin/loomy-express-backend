const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
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
 *       500:
 *         description: Internal server error while registering the user
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
router.post("/signin", async (req, res) => {
  return authHandler.userSigninHandler(req, res);
});


module.exports = router;
