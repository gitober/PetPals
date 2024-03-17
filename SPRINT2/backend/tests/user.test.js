const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");

beforeAll(async () => {
  await User.deleteMany({});
});

describe('User Routes', () => {

  describe('POST /api/users/signup', () => {
    it('should signup a new user with valid credentials', async () => {
      // Arrange
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'R3g5T7#gh'
      };

      // Act
      const response = await api
        .post('/api/users/signup')
        .send(userData);

      // Assert
      expect(response.status).toBe(200); // Adjusted to expect status code 200
      expect(response.body).toHaveProperty('token');
    });

    it('should return an error with invalid credentials', async () => {
      // Arrange
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'invalidpassword'
      };

      // Act
      const response = await api
        .post('/api/users/signup')
        .send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login a user with valid credentials', async () => {
      // Arrange
      const userData = {
        username: 'testuser',
        password: 'R3g5T7#gh'
      };

      // Act
      const response = await api
        .post('/api/users/login')
        .send(userData);

      // Assert
      expect(response.status).toBe(200); // Adjusted to expect status code 200
      expect(response.body).toHaveProperty('token');
    });

    it('should return an error with invalid credentials', async () => {
      // Arrange
      const userData = {
        username: 'testuser',
        password: 'invalidpassword'
      };

      // Act
      const response = await api
        .post('/api/users/login')
        .send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

   describe('GET /api/users', () => {
    it('should get all users', async () => {
      // Act
      const response = await api
        .get('/api/users');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/users/:username', () => {
    it('should get a user by username', async () => {
      // Arrange
      const username = 'testuser';

      // Act
      const response = await api
        .get(`/api/users/${username}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', username);
    });

    it('should return an error if user not found', async () => {
      // Arrange
      const username = 'unknownuser';

      // Act
      const response = await api
        .get(`/api/users/${username}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/users/:username', () => {
    it('should update a user by username', async () => {
      // Arrange
      const username = 'testuser';
      const updatedEmail = 'updated@example.com';
      const updatedPassword = 'NewPassword123';

      // Act
      const response = await api
        .patch(`/api/users/${username}`)
        .send({ email: updatedEmail, password: updatedPassword });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', updatedEmail);
    });

    it('should return an error if user not found', async () => {
      // Arrange
      const username = 'unknownuser';

      // Act
      const response = await api
        .patch(`/api/users/${username}`)
        .send({ email: 'updated@example.com', password: 'NewPassword123' });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});


afterAll(() => {
  mongoose.connection.close();
});
