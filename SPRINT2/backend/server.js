// server.js
const express = require("express");
const loggerMiddleware = require("./middleware/loggerMiddleware"); // Adjust the middleware path
const petRoutes = require("./routes/petRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(loggerMiddleware);

// Routes
app.use("/api", petRoutes);
app.use("/api", postRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
