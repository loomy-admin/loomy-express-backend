const fs = require("fs");
const glob = require("glob");

// Print the matched files
const matchedFiles = glob.sync("./router/*.js");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Loomy API",
      version: "1.0.0",
      description: "API documentation for Loomy",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: matchedFiles, // now dynamically injected
};

const swaggerSpec = require("swagger-jsdoc")(options);

module.exports = { swaggerUi: require("swagger-ui-express"), swaggerSpec };
