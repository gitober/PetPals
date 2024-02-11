// This code connects to MongoDB using Mongoose, checking for the existence of the MongoDB URI in environment
// variables. It logs the URI, attempts to connect with specified options, and exports the function for reuse.

require("dotenv").config();

const mongoose = require("mongoose");

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined in environment variables
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is not defined in the environment variables");
      // Exit the process with an error code if MONGO_URI is not defined
      process.exit(1);
    }

    // Retrieve MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI;
    console.log("MONGO_URI:", mongoURI);

    // Connect to MongoDB with useNewUrlParser and useUnifiedTopology options
    // useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version!
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log a success message when connected to MongoDB
    console.log("Connected to MongoDB");
  } catch (error) {
    // Log an error message if an error occurs during the connection
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit the process with an error code if an error occurs
    process.exit(1);
  }
};

module.exports = connectDB;
