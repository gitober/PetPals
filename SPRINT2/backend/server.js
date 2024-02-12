require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");
const notifyRouter = require("./routers/notifyRouter");
const messageRouter = require("./routers/messageRouter");

const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

const app = express();

app.use(express.json()); // Move this line here to parse the request body
app.use(cors());
app.use(cookieParser());

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.originalUrl}`);
  if (
    req.method === "GET" ||
    req.method === "PUT" ||
    req.method === "POST" ||
    req.method === "DELETE" ||
    req.method === "HEAD" ||
    req.method === "OPTIONS" ||
    req.method === "PATCH"
  ) {
    console.log("Data received:", req.body);
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Check if the error is a known type
  if (err.name === 'ValidationError') {
    // Handle validation errors
    return res.status(400).json({ error: 'Validation Error', message: err.message });
  }

  // Handle other types of errors
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.use("/api", authRouter);
app.use("/api", postRouter);
app.use("/api", userRouter);
app.use("/api", commentRouter);
app.use("/api", notifyRouter);
app.use("/api", messageRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;
const URL = process.env.MONGO_URI;

connectDB();

// FOR BACKEND SERVER TESTING!! LET'S KEEP THIS UNTIL WE CONNECT FRONTEND TO BACKEND
app.listen(PORT || 5000, () => {
  console.log(`Server is running on port ${PORT}`);
});

// CONNECTING FRONTEND TO BACKEND - LATERS
//const http = require("http").createServer(app);
//const io = require("socket.io")(http);

// CONNECTING FRONTEND TO BACKEND - LATERS
// io.on("connection", (socket) => {
//   socketServer(socket);
// });

// CONNECTING FRONTEND TO BACKEND - LATERS
// http.listen(port, () => {
//   console.log(`app is running on ${port}`);
// });
