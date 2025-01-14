const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB using the MONGO_URI from the .env file (use the TEST_MONGO_URI for testing)
    const mongoURI = process.env.NODE_ENV === "test" ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;

    console.log(`Attempting to connect to MongoDB (${process.env.NODE_ENV}): ${mongoURI}`);

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
