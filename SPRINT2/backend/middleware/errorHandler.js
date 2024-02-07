// Middleware to handle errors
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Customize the error response based on your needs
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
};

module.exports = errorHandler;
