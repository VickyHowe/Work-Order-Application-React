/**
 * Swagger configuration for API documentation.
 *
 * This configuration sets up Swagger to document the API routes
 * and provides metadata about the API.
 */

require("dotenv").config({
    path: "./.env",
});

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Work Order Application API",
            version: "1.0.0",
            description: "API documentation for work order application routes",
        },
        servers: [
            {
                url: process.env.API_BASE_URL || "http://localhost:5000/api", 
            },
        ],
    },
    // Route files to be documented
    apis: ["./routes/**/*.js"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };