const connectToSupabase = require('../connectors/connectToSupabase');
const logger = require('../connectors/logger');

const supabase = connectToSupabase();

// Insert multiple fun facts
exports.insertManyFF = async (docs) => {
  try {
    logger.info("funFactRepository.insertManyFF START");

    // Insert all docs at once (batch insert)
    const { error } = await supabase
      .from('fun_facts')
      .insert(docs); // Supabase supports array inserts

    if (error) {
      throw error;
    }

    logger.info("funFactRepository.insertManyFF STOP");
  } catch (error) {
    logger.error("Error in insertManyFF:", error);
    throw error;
  }
};

// Get a random fun fact by grade and age
// exports.getRandomFunFactByGroup = async (age, grade) => {
//   try {
//     logger.info("funFactRepository.getRandomFunFactByGroup START");

//     // Supabase doesn't support `order by random()` directly in query builder
//     // So fetch filtered results first, then randomly pick one in JS
//     const { data, error } = await supabase
//       .from('fun_facts')
//       .select('*')
//       .filter('grade_range', 'cs', `{${grade}}`)
//       .filter('age_range', 'cs', `{${age}}`);

//     if (error) throw error;

//     const randomFact = data[Math.floor(Math.random() * data.length)] || null;

//     logger.info("funFactRepository.getRandomFunFactByGroup STOP");
//     return randomFact;
//   } catch (error) {
//     logger.error("Error in getRandomFunFactByGroup:", error);
//     throw error;
//   }
// };
