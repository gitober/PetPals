require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const customMiddleware = require("./middleware/customMiddleware");
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");
const userRouter = require("./routers/userRouter");

//const cookieParser = require("cookie-parser");
//const bodyParser = require("body-parser");
//const multer = require("multer");
//const path = require("path");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(customMiddleware.requestLogger);

app.get("/", (req, res) => res.send("Root of the server!"));

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

app.use(customMiddleware.unknownEndpoint);
app.use(customMiddleware.errorHandler);

module.exports = app;