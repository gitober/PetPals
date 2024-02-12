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

app.use(express.json()); // Use express.json() for parsing the request body
app.use(cors());
app.use(cookieParser());

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.originalUrl}`);
  if (
    ["GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS", "PATCH"].includes(
      req.method
    )
  ) {
    console.log("Data received:", req.body);
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ error: "Validation Error", message: err.message });
  }

  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
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

connectDB();

app.listen(PORT, () => {
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
