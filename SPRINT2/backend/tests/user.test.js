// tests/user.test.js
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server"); // Adjust the path to match your server file's location

const api = supertest(app);

// Helper function to create a user for test purposes
const createUser = async () => {
  const newUser = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    story: "A test story",
    // Add any other required fields based on your model
  };

  await api
    .post("/api/user") // Adjust this endpoint based on how your user creation route is defined
    .send(newUser);
};

// Connect to the test database before running tests
beforeAll(async () => {
  const url = process.env.TEST_MONGODB_URI; // Ensure this is set in your environment or directly here
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clean up and close the database connection after tests
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("User operations", () => {
  beforeEach(async () => {
    // Optionally clear the users collection before each test if needed
    await mongoose.connection.db.collection('users').deleteMany({});
    await createUser(); // Create a user before each test if needed for fetching, updating, etc.
  });

  it("should create a new user with valid details", async () => {
    const newUser = {
      username: "newuser",
      email: "newuser@example.com",
      password: "newpassword123",
      story: "A new test story",
      // Add any other required fields
    };

    await api
      .post("/api/user") // Adjust this endpoint as needed
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /json/);
    // Add assertions to verify the creation as needed
  });

  // Add more tests for fetching, updating, and deleting users as needed
});

afterAll(async () => {
  await mongoose.connection.close();
});
