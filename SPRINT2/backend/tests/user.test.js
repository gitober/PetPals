const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");

let token;

beforeAll(async () => {
  await User.deleteMany({}); // Clear the database before running tests
});

describe('User Routes', () => {
  describe('POST /api/users/signup', () => {
    it('should create a new user with valid credentials', async () => {
      const userData = {
        username: 'testi1',
        email: 'testi1@testi.com',
        password: 'Securepassword123#!',
      };

      const response = await api.post('/api/users/signup').send(userData);
      token = response.body.token;

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should not create a new user with invalid credentials', async () => {
      const userData = {
        username: 'testi1',
        email: 'testi1@testi.com',
        password: 'invalidpassword',
      };

      const response = await api.post('/api/users/signup').send(userData);
      token = response.body.token;

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login a user with valid credentials', async () => {
      const userData = {
        username: 'testi1',
        password: 'Securepassword123#!',
      };

      const response = await api.post('/api/users/login').send(userData);
      token = response.body.token;

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should not login a user with invalid credentials', async () => {
      const userData = {
        username: 'testi1',
        password: 'invalidpassword',
      };

      const response = await api.post('/api/users/login').send(userData);
      token = response.body.token;

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await api
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`); // Include the authentication token

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1); // Assuming only one user is signed up
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const userData = {
        username: 'testi1',
        email: 'testi1@testi.com',
        password: 'Securepassword123#!',
      };

      const newUser = await api.post('/api/users/signup').send(userData);

      const response = await api.get(`/api/users/${newUser.body._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', 'testi1');
      expect(response.body).toHaveProperty('email', 'testi1@testi.com');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user profile', async () => {
      const userData = {
        username: 'testi1',
        email: 'testi1@testi.com',
        password: 'Securepassword123#!',
      };

      const newUser = await api.post('/api/users/signup').send(userData);

      const updatedUserData = {
        bioText: 'I am a test user',
      };

      const response = await api
        .put(`/api/users/${newUser.body._id}`)
        .send(updatedUserData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('bioText');
    });
  });

  describe('PATCH /api/users/:id/follow', () => {
    it('should follow a user', async () => {
      const userData1 = {
        username: 'testi1',
        email: 'testi1@testi.com',
        password: 'Securepassword123#!',
      };

      const userData2 = {
        username: 'testi2',
        email: 'testi2@testi.com',
        password: 'Securepassword1234#!',
      };

      const user1 = await api.post('/api/users/signup').send(userData1);
      const user2 = await api.post('/api/users/signup').send(userData2);

      const loginResponse = await api
        .post('/api/users/login')
        .send({ username: userData1.username, password: userData1.password });

      const token = loginResponse.body.token;

      const response = await api
        .patch(`/api/users/${user1.body._id}/follow`)
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: user2.body._id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('following');
    });
  });

  describe('PATCH /api/users/:id/unfollow', () => {
    it('should unfollow a user', async () => {
      const userData1 = {
        username: 'testi1',
        email: 'testi1@testi.com',
        password: 'Securepassword123#!',
      };

      const userData2 = {
        username: 'testi2',
        email: 'testi2@testi.com',
        password: 'Securepassword1234#!',
      };

      const user1 = await api.post('/api/users/signup').send(userData1);
      const user2 = await api.post('/api/users/signup').send(userData2);

      await api
        .patch(`/api/users/${user1.body._id}/follow`)
        .send({ userId: user2.body._id });

      const loginResponse = await api
        .post('/api/users/login')
        .send({ username: userData1.username, password: userData1.password });

      const token = loginResponse.body.token;

      const response = await api
        .patch(`/api/users/${user1.body._id}/unfollow`)
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: user2.body._id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('following');
    });
  });

afterAll(async () => {
    await mongoose.connection.close(); // Close the database connection
  });
});