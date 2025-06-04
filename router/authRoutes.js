const express = require("express");
const router = express.Router();

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
