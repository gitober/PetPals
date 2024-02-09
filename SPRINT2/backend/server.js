const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const connectDB = require("./config/db"); // Adjust the path if needed
const User = require("./models/userModel");
const Post = require("./models/postModel"); // Adjust the path if needed

const seedUsersToDatabase = async () => {
  try {
    // Implementation to seed users to the database
    // ...

    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error.message);
  } finally {
    connectDB.close(); // Close the MongoDB connection
  }
};

// Uncomment the line below if you want to seed users when the server starts
// seedUsersToDatabase();

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Simple route for the root path
app.get("/", (req, res) => {
  res.send("Hyvvee päivää!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
