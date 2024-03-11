// tests/auth.test.js
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Adjust the path as necessary
require("dotenv").config({ path: "./.env.test" }); // Ensure you're loading your test environment variables

const api = supertest(app);

beforeAll(async () => {
    await mongoose.disconnect(); // Ensure any existing connection is closed before creating a new one
    await mongoose.connect(process.env.TEST_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });

beforeEach(async () => {
  // Assuming you have a User model and want to clear the users collection before each test
  await mongoose.connection.db.collection('users').deleteMany({});
});

describe('Auth operations', () => {
  test('register a new user', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password',
    };

    await api
      .post('/api/register') // Adjust according to your endpoint
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /json/);

    // Additional assertions...
  });

  // Additional tests for login, logout...
});

