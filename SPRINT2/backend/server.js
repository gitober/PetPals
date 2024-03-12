const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

// Import your routers and models
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");
const connectDB = require("./config/db"); // Import the connectDB function
const Post = require("./models/postModel");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the actual origin of your frontend
  credentials: true,
};
app.use(cors(corsOptions));

// Logging middleware
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.originalUrl}`);
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

// Body-parser configuration with increased payload size limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api", authRouter);
app.use("/api", postRouter);
app.use("/api", userRouter);
app.use("/api", commentRouter);

// Multer configuration for image uploads
const upload = multer({ dest: 'uploads/', limits: { fileSize: 50 * 1024 * 1024 } });

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

// Example in-memory data structure to store likes
const likesData = {};

// Endpoint to handle like toggles
app.post('/api/like', (req, res) => {
  const { imageUrl } = req.body;

  // Toggle like in your data structure (you might use a database in a real-world scenario)
  likesData[imageUrl] = !likesData[imageUrl];

  res.json({ success: true, liked: likesData[imageUrl] });
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

// 404 and error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${server.address().port}`);
  server.maxHttpHeaderSize = 16 * 1024;
});
