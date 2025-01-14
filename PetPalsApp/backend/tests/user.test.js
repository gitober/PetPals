const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");

beforeAll(async () => {
  await User.deleteMany({});
});

// Test for signup
describe("User Routes", () => {
  describe("POST /api/users/signup", () => {
    it("should signup a new user with valid credentials", async () => {
      // Arrange
      const userData = {
        username: "testuser1",
        email: "test@example.com",
        password: "R3g5T7#gh",
      };

      // Act
      const response = await api.post("/api/users/signup").send(userData);

      // Assert
      expect(response.status).toBe(201); // Updated to expect 201
      expect(response.body).toHaveProperty("message", "Signup successful");
    });

    it("should return an error with invalid credentials", async () => {
      // Arrange
      const userData = {
        username: "testuser1",
        email: "invalid-email",
        password: "weak",
      };

      // Act
      const response = await api.post("/api/users/signup").send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  // Test for login
  describe("POST /api/users/login", () => {
    beforeAll(async () => {
      const user = {
        username: "testuser1",
        email: "test@example.com",
        password: "R3g5T7#gh",
      };
      await api.post("/api/users/signup").send(user);
    });

    it("should login a user with valid credentials", async () => {
      // Arrange
      const userData = {
        username: "testuser1",
        password: "R3g5T7#gh",
      };

      // Act
      const response = await api.post("/api/users/login").send(userData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken"); // Updated to check for accessToken
    });

    it("should return an error with invalid credentials", async () => {
      // Arrange
      const userData = {
        username: "testuser1",
        password: "wrongpassword",
      };

      // Act
      const response = await api.post("/api/users/login").send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  // Test for getting all users
  describe("GET /api/users", () => {
    it("should get all users", async () => {
      // Act
      const response = await api.get("/api/users");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  // Test for getting a user by username
  describe("GET /api/users/:username", () => {
    beforeAll(async () => {
      const user = {
        username: "testuser1",
        email: "test@example.com",
        password: "R3g5T7#gh",
      };
      await api.post("/api/users/signup").send(user);
    });

    it("should get a user by username", async () => {
      // Arrange
      const username = "testuser1";

      // Act
      const response = await api.get(`/api/users/${username}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("username", username);
    });

    it("should return an error if user not found", async () => {
      // Arrange
      const username = "unknownuser";

      // Act
      const response = await api.get(`/api/users/${username}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });

  // Test for updating a user by username
  describe("PATCH /api/users/:username", () => {
    let token;
  
    beforeAll(async () => {
      // Signup and login to get a valid token
      const userData = {
        username: "testuser1",
        email: "test@example.com",
        password: "R3g5T7#gh",
      };
      await api.post("/api/users/signup").send(userData);
      const loginResponse = await api.post("/api/users/login").send({
        username: userData.username,
        password: userData.password,
      });
      token = loginResponse.body.accessToken;
    });
  
    it("should update a user by username", async () => {
      // Arrange
      const username = "testuser1";
      const updatedEmail = "updated@example.com";
      const updatedPassword = "NewPassword123";
  
      // Act
      const response = await api
        .patch(`/api/users/${username}`)
        .set("Authorization", `Bearer ${token}`) // Include the token in the header
        .send({ email: updatedEmail, password: updatedPassword });
  
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("email", updatedEmail);
    });
  
    it("should return an error if user not found", async () => {
      // Arrange
      const username = "unknownuser";
  
      // Act
      const response = await api
        .patch(`/api/users/${username}`)
        .set("Authorization", `Bearer ${token}`) // Include the token in the header
        .send({ email: "updated@example.com", password: "NewPassword123" });
  
      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
