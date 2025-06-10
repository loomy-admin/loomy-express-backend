const express = require('express');
const router = express.Router();
const funFactHandler = require("../handlers/funFactHandler");

router.post('/funfacts/bulk', bulkIngestionFF);
function bulkIngestionFF(req, res) {
    return funFactHandler.insertFunFactHandler(req, res);
}

// router.get('/funfact', getFunFact);
// function getFunFact(req, res) {
//     return funFactHandler.getFunFactHandler(req, res);
// }

module.exports = router;
