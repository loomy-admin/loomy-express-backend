const express = require("express");
const cors = require("cors");
const path = require("path");
const { swaggerUi, swaggerSpec } = require("./swagger");
const requestResponseLogger = require("./middleware/loggerMiddleware");
const logger = require("./connectors/logger");
const { swaggerAuth } = require("./middleware/swaggerAuth");
const authRoutes = require("./router/authRoutes");
const adminRoutes = require("./router/adminRoutes");
const connectToSupabase = require("./connectors/connectToSupabase");
const cron = require('node-cron');
const { incrementBirthdayAges } = require("./util/birthdayAgeUpdater");
require("dotenv").config(); 

const app = express();

// Middleware for logging requests and responses
app.use(requestResponseLogger);

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS Configuration
const corsOptions = {
    origin: [
        "http://localhost:8080",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8081"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Database connection check 
const supabase = connectToSupabase();

(async () => {
  try {
    const { error } = await supabase.auth.getSession(); // lightweight check

    if (error) {
      logger.error("Supabase connection failed at startup:", error);
      process.exit(1);
    }

    logger.info("Supabase client is reachable and initialized.");
  } catch (err) {
    logger.error("Unexpected error while checking Supabase connection:", err);
    process.exit(1);
  }
})();

/*******************************************************************************/ 
/********************************ROUTERS****************************************/
/*******************************************************************************/
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/admin", adminRoutes);
app.use("/api-docs", swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (req, res) => {
    logger.info("Welcome Route START");
    logger.info("Welcome Route END");
    res.status(200).json({ message: "Your Backend API is working properly" })
});

// Static files
app.use(express.static(path.join(__dirname, "public")));

cron.schedule('0 0 * * *', () => {
  logger.info("⏰ Running birthday age updater at midnight");
  incrementBirthdayAges();
});

// Start server
const PORT = 4000;
const server = app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
