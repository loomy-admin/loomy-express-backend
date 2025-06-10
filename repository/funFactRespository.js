const logger = require('../connectors/logger');
const FunFacts = require("../models/FunFacts");

exports.insertManyFF = async (docs) => {
    try {
        logger.info("funFactRepository.insertManyFF START");
        return await FunFacts.insertMany(docs);
    }
    catch (error) {
        logger.error("Error in insertManyFF:", error);
    }
    finally {
        logger.info("funFactRepository.insertManyFF STOP");
    }
}

// exports.getRandomFunFactByGroup = async (age, grade) => {
//     try {
//         logger.info("funFactRepository.getRandomFunFactByGroup START");
//         const result = await FunFacts.aggregate([
//             {
//                 $match: {
//                     $expr: {
//                         $and: [
//                             { $lte: [grade, { $arrayElemAt: ["$gradeRange", 1] }] },
//                             { $gte: [grade, { $arrayElemAt: ["$gradeRange", 0] }] },
//                             { $lte: [age, { $arrayElemAt: ["$ageRange", 1] }] },
//                             { $gte: [age, { $arrayElemAt: ["$ageRange", 0] }] },
//                         ]
//                     }
//                 }
//             },
//             { $sample: { size: 1 } }
//         ]);

//         return result[0] || null;
//     }
//     catch (error) {
//         logger.error("Error in getRandomFunFactByGroup:", error);

//     }
//     finally {
//         logger.info("funFactRepository.getRandomFunFactByGroup STOP");
//     }
// }