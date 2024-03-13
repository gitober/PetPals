// Middleware for logging request details
const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};

// Middleware for handling unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "Unknown endpoint" });
};

// Middleware for handling errors
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    // Set response status code based on error status or default to 500
    response.status(error.status || 500);

    response.json({
        error: error.message,
    });
};

module.exports = { requestLogger, errorHandler, unknownEndpoint};
