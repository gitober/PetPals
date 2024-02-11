// error handling middleware is intended to be used in the backend of your application. It ensures that
// if any errors occur during the processing of a request, a standardized error response is sent back to the client.

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
};

module.exports = errorHandler;
