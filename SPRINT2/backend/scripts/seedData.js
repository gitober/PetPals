const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { seedUsersToDatabase } = require("../models/userModel");
const { seedPostsToDatabase } = require("../models/postModel");
const connectDB = require("../config/db");

console.log("Starting script");
console.log("MONGO_URI:", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in the environment variables");
  process.exit(1);
}

async function runScript() {
  let connection;
  try {
    console.log("Connecting to MongoDB");
    connection = await connectDB();

    // Seed users
    console.log("Seeding users...");
    await seedUsersToDatabase();

    // Seed posts after users are seeded
    console.log("Seeding posts...");
    await seedPostsToDatabase();

    console.log("Data seeding completed successfully");
  } catch (error) {
    console.error("Error during script execution:", error.message);
  } finally {
    if (connection) {
      console.log("Closing MongoDB connection");
      connection.disconnect();
    }
    console.log("Script completed");
  }
}

runScript();
