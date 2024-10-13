import swaggerJsdoc from "swagger-jsdoc";
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "store swagger",
        version: "1.0.0",
        description: "store api request",
    },
    servers: [
        {
            url: "http://localhost:3000",
        },
    ],
};
const options = {
    definition: swaggerDefinition, // השתמש ב-definition במקום swaggerDefinitions
    apis: ["./routes/*.js", "./server.js"],
};
export const swaggerSpec = swaggerJsdoc(options);
