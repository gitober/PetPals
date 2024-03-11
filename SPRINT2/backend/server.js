const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const multer = require("multer"); // Add this line

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");
const notifyRouter = require("./routers/notifyRouter");
const messageRouter = require("./routers/messageRouter");
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

const Post = require("./models/postModel");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

// Configure multer for handling image uploads
const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }); // Set a limit for image size

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the actual origin of your frontend
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware and existing routes...
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.originalUrl}`);
  
  // Add this log for CORS headers
  console.log("CORS headers:", res.getHeaders());

  if (["GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS", "PATCH"].includes(req.method)) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '*'.repeat(sanitizedBody.password.length);
    }

    console.log("Data received:", sanitizedBody);
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "Validation Error", message: err.message });
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Existing routes...
app.use("/api", authRouter);
app.use("/api", postRouter);
app.use("/api", userRouter);
app.use("/api", commentRouter);
app.use("/api", notifyRouter);
app.use("/api", messageRouter);

// Implement the /api/posts route with multer middleware for image uploads
app.post("/api/posts", upload.array("images", 5), async (req, res) => {
  try {
    const { content } = req.body;
    const images = req.files.map(image => ({ data: image.buffer }));

    // Log the received data for debugging
    console.log("Received POST request to /api/posts");
    console.log("Data received:", { content, images });

    // Save to MongoDB
    const newPost = new Post({
      content,
      images,
    });

    const savedPost = await newPost.save();

    res.json({ message: "Post saved", newPost: savedPost });
  } catch (error) {
    console.error("Error handling post request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 404 and error handling middleware...
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${server.address().port}`);
  server.maxHttpHeaderSize = 16 * 1024;
});

// Export `app` for use in tests
module.exports = app;

// Conditionally start the server only if this file is the entry point to the application
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${server.address().port}`);
  });
}