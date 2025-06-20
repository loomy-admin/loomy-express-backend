const logger = require("../connectors/logger");
const { FAILED_TO_INSERT_BULK_FUNFACTS, FAILED_TO_GET_FUN_FACT } = require("../constants/errorConstants");
const funFactRepository = require("../repository/funFactRespository");
const { FUN_FACTS_INSERTED_SUCCESSFULLY } = require("../constants/general");
const { generateTimeStamp } = require("../util/dateAndTimeUtil");
// const { getCachedFunFact, getGradeGroup } = require("../util/gradeGroup");
// const { FUNFACT_CACHE_TTL } = require("../constants/timeConstants");

// const cache = {};

exports.insertFunFactService = async (req, res) => {
  try {
    logger.info("funFactService.insertFunFactService START");

    const funFactsArray = req.body.funFacts;

    const docs = funFactsArray.map(text => ({
      text,
      gradeRange: [8, 10],
      ageRange: [13, 16],
      createdAt: generateTimeStamp(),
      updatedAt: generateTimeStamp(),
    }));

    await funFactRepository.insertManyFF(docs);

    logger.info("funFactService.insertFunFactService STOP");
    return res.status(200).json({ message: FUN_FACTS_INSERTED_SUCCESSFULLY });
  } catch (error) {
    logger.error("Error in insertFunFactService:", error);
    return res.status(500).json({ error: FAILED_TO_INSERT_BULK_FUNFACTS });
  }
};

// exports.getRandomFunFactByGroup = async (req, res) => {
//   try {
//     logger.info("funFactService.getRandomFunFactByGroup START");
//     const { age, grade } = req.query;

//     if (!age || !grade) {
//       return res.status(400).json({ message: 'Both age and grade are required.' });
//     }

//     const funFact = await funFactRepository.getRandomFunFactByGroup(parseInt(age), parseInt(grade));
//     if (!funFact) return res.status(404).json({ message: 'No fun fact found.' });

//     logger.info("funFactService.getRandomFunFactByGroup STOP");
//     return res.status(200).json({ funFact });
//   } catch (error) {
//     logger.error("Error in getRandomFunFactByGroup:", error);
//     return res.status(500).json({ error: FAILED_TO_GET_FUN_FACT });
//   }
// };
