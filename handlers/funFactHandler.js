const funFactService = require("../service/funFactService");
const { generateTimeStamp } = require("../util/dateAndTimeUtil");
const logger = require("../connectors/logger");
const { FUN_FACT_BULK_INGESTION, GET_FUN_FACT } = require("../constants/eventConstants");
const { insertEvent } = require("../repository/eventRepository");
const { FAILED_TO_INSERT_BULK_FUNFACTS, FAILED_TO_GET_FUN_FACT } = require("../constants/errorConstants");

exports.insertFunFactHandler = async (req, res) => {
  logger.info("funFactHandler.insertFunFactHandler START");
  try {
        const event = {
            eventType: FUN_FACT_BULK_INGESTION,
            userName: "",
            URL: req.url,
            ipAddress: [req.ip],
            httpMethod: req.method,
            requestPayload: JSON.stringify(req.body),
            createdAt: generateTimeStamp(),
        };
        await insertEvent(event);
        return funFactService.insertFunFactService(req, res);
    }
    catch (error) {
        logger.error("Error in insertFunFactHandler:", error);
        return res.status(500).json({ error: FAILED_TO_INSERT_BULK_FUNFACTS });
    } finally {
        logger.info("funFactHandler.insertFunFactHandler STOP");
    }
};

// exports.getFunFactHandler = async (req, res) => {
//   logger.info("funFactHandler.getFunFactHandler START");
//   try {
//         const event = {
//             eventType: GET_FUN_FACT,
//             userName: "",
//             URL: req.url,
//             ipAddress: [req.ip],
//             httpMethod: req.method,
//             requestPayload: "",
//             createdAt: generateTimeStamp(),
//         };
//         await insertEvent(event);
//         return funFactService.getRandomFunFactByGroup(req, res);
//     }
//     catch (error) {
//         logger.error("Error in getFunFactHandler:", error);
//         return res.status(500).json({ error: FAILED_TO_GET_FUN_FACT });
//     } finally {
//         logger.info("funFactHandler.getFunFactHandler STOP");
//     }
// }
