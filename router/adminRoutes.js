const express = require('express');
const router = express.Router();
const funFactHandler = require("../handlers/funFactHandler");


/**
 * @swagger
 * /v1/api/funfacts/bulk:
 *   post:
 *     summary: Bulk insert fun facts
 *     tags: [Fun Fact Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - funFacts
 *             properties:
 *               funFacts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["The Moon has moonquakes.", "Octopuses have three hearts."]
 *     responses:
 *       200:
 *         description: Fun facts inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fun facts inserted successfully
 *       400:
 *         description: Bad Request - Invalid input format
 *       500:
 *         description: Internal server error while inserting fun facts
 */
router.post('/funfacts/bulk', bulkIngestionFF);
function bulkIngestionFF(req, res) {
    return funFactHandler.insertFunFactHandler(req, res);
}

// router.get('/funfact', getFunFact);
// function getFunFact(req, res) {
//     return funFactHandler.getFunFactHandler(req, res);
// }

module.exports = router;
