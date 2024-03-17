require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const customMiddleware = require("./middleware/customMiddleware");
const postRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
const commentRouter = require("./routers/commentRouter");

// const multer = require("multer");
// const path = require("path");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename: (req, file, cb) => {
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 10
//     }
// });

// app.use('/profile', express.static('upload/images'));
// app.post("/upload", upload.single('profile'), (req, res) => {
//     res.json({
//         success: 1,
//         profile_url: `http://localhost:5000/profile/${req.file.filename}`
//     });
// });

// function errHandler(err, req, res, next) {
//     if (err instanceof multer.MulterError) {
//         res.json({
//             success: 0,
//             message: err.message
//         });
//     }
// }
// app.use(errHandler);

app.use(customMiddleware.requestLogger);

app.get("/", (req, res) => res.send("Root of the server!"));

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/posts", commentRouter);

app.use(customMiddleware.unknownEndpoint);
app.use(customMiddleware.errorHandler);

module.exports = app;
