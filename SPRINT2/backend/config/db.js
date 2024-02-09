require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is not defined in the environment variables");
      process.exit(1);
    }

    const mongoURI = process.env.MONGO_URI;
    console.log("MONGO_URI:", mongoURI);

    // Connect to MongoDB
    await mongoose.connect(mongoURI);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
