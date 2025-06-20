// const mongoose = require("mongoose");
// const logger = require("./logger"); 
// require("dotenv").config(); 

// const connectToMongo = async () => {
//     const uri = process.env.MONGO_DB_URL;
//     try {
//         await mongoose.connect(uri);
//         logger.info("Connected to MongoDB - Loomy");
//     } catch (err) {
//         logger.error("Could not connect to MongoDB - Loomy", err);
//     }

//     return mongoose.connection; // Return the connection for use elsewhere
// };

// // Export the function
// module.exports = connectToMongo;
