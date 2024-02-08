const connectDB = require("./config/db");
const express = require("express");
const cookieParser = require("cookie-parser"); // CHECKCHECK

const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
const authRoutes = require("../routes/authRoutes");
const postRoutes = require("../routes/postRoutes");
const userRoutes = require("../routes/userRoutes");

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Start the server
const PORT = process.env.PORT || 5000; // MUISTA PORTTI!!
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
