require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./config/db");
const customMiddleware = require("./middleware/customMiddleware");
const postRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
const commentRouter = require("./routers/commentRouter");

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware (helmet)
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allows cross-origin resource sharing
  })
);

// Rate Limiting middleware
if (process.env.NODE_ENV === "production") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
  });
  app.use(limiter);
}

// Logging middleware (morgan)
app.use(morgan("dev"));

// CORS middleware
const allowedOrigins = [
  process.env.FRONTEND_URL, // Frontend URL from environment
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error("CORS policy violation: Origin not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Log all incoming headers (for debugging)
app.use((req, res, next) => {
  console.log("Incoming Request Headers:", req.headers);
  next();
});

// Middleware to parse JSON and URL-encoded payloads
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads

// Serve static files from the "uploads" directory
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

// Log request details for debugging (only in development mode)
if (process.env.NODE_ENV === "development") {
  app.use(customMiddleware.requestLogger);
}

// API Routes
app.get("/", (req, res) => res.send("Root of the server!")); // Root route
app.use("/api/users", userRouter); // User-related routes
app.use("/api/posts", postRouter); // Post-related routes
app.use("/api/comments", commentRouter); // Comment-related routes

// Serve frontend static files in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "frontend/build");
  app.use(express.static(frontendPath)); // Serve static frontend files

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html")); // Serve React's index.html
  });
}

// Middleware for unknown endpoints
app.use(customMiddleware.unknownEndpoint);

// Error handling middleware
app.use(customMiddleware.errorHandler);

module.exports = app;
