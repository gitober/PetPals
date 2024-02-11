// notFoundMiddleware specifically handles the case where a route or resource is not found (HTTP 404). 
// It's a way to gracefully handle requests for routes that don't match any of your defined endpoints.

const express = require("express");

const notFound = (req, res, next) => {
  const err = {
    code: 404,
    message: "Not Found",
  };
  res.status(err.code).json(err.message);
};

module.exports = notFound;
