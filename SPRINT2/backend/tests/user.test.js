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
    it('should signup a new user with credentials', async () => {
      const userData = {
        username: 'Testi5',
        email: 'testi@testi.com',
        password: 'R3g5T7#ghfR'
      };

      const response = await api
        .post('/api/users/signup')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
    });

    it('should return an error with invalid credentials', async () => {
      const userData = {
        username: 'Testi5',
        email: 'testi@testi.com',
        password: 'invalidpassword'
      };

      const response = await api
        .post('/api/users/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login a user with valid credentials', async () => {
      const userData = {
        username: 'Testi5',
        password: 'R3g5T7#ghfR'
      };

      const response = await api
        .post('/api/users/login')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return an error with invalid credentials', async () => {
      const userData = {
        username: 'Testi5',
        password: 'invalidpassword'
      };

      const response = await api
        .post('/api/users/login')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/users', () => {
    it('should get all users', async () => {
      // Login with a user to get the authentication token
      const loginResponse = await api.post('/api/users/login').send({
        username: 'Testi5',
        password: 'R3g5T7#ghfR'
      });

      const token = loginResponse.body.token;

      // Fetch all users with the authentication token
      const response = await api
        .get('/api/users/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
    });
  });

  describe('GET /api/users/users/:id', () => {
    it('should get a user by id', async () => {
      // Create a user for testing
      const signupResponse = await api.post('/api/users/signup').send({
        username: 'Testi5',
        email: 'testi@testi.com',
        password: 'R3g5T7#ghfR'
      });

      const userId = signupResponse.body.user._id;

      // Retrieve the user by ID
      const response = await api.get(`/api/users/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
    });

    it('should return error if user id is invalid', async () => {
      // Attempt to retrieve a user with an invalid ID
      const response = await api.get('/api/users/users/invalid_id');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('PUT /api/users/users/:id', () => {
    it('should update user profile', async () => {
      // Login with a user
      const loginResponse = await api.post('/api/users/login').send({
        username: 'Testi5',
        password: 'R3g5T7#ghfR'
      });

      const token = loginResponse.body.token;

      // Update user profile
      const updatedUserData = {
        username: 'updatedUsername',
        email: 'updatedEmail@test.com',
        newPassword: 'newPassword123'
      };

      const response = await api
        .put(`/api/users/users/${loginResponse.body.userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedUserData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated for user updatedUsername');
    });

    it('should return error if username is not provided', async () => {
      // Login with a user
      const loginResponse = await api.post('/api/users/login').send({
        username: 'Testi5',
        password: 'R3g5T7#ghfR'
      });

      const token = loginResponse.body.token;

      // Update user profile with missing username
      const updatedUserData = {
        email: 'updatedEmail@test.com',
        newPassword: 'newPassword123'
      };

      const response = await api
        .put(`/api/users/users/${loginResponse.body.userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedUserData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Please provide username, email, and password.');
    });
  });

  describe('PATCH /api/users/users/:id/follow', () => {
    it('should follow a user', async () => {
      // Create two users for testing
      const user1SignupResponse = await api.post('/api/users/signup').send({
        email: 'testi5@testi.com',
        password: 'R3g5T7#ghfR'
      });

      const user2SignupResponse = await api.post('/api/users/signup').send({
        email: 'testi6@testi.com',
        password: 'R3g5T7#ghfR'
      });

      const userToFollowId = user2SignupResponse.body.user._id;

      // Login with the first user to get the authentication token
      const loginResponse = await api.post('/api/users/login').send({
        username: 'Testi5',
        password: 'R3g5T7#ghfR'
      });

      const token = loginResponse.body.token;

      // Follow the user with the authentication token
      const response = await api
        .patch(`/api/users/users/${userToFollowId}/follow`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Followed');
    });

    it('should return error if user to follow is not found', async () => {
      // Login with a user to get the authentication token
      const loginResponse = await api.post('/api/users/login').send({
        username: 'Testi5',
        password: 'R3g5T7#ghfR'
      });

      const token = loginResponse.body.token;

      // Follow a user with an invalid id
      const response = await api
        .patch('/api/users/users/invalid_id/follow')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User to follow not found');
    });
  });

  describe('PATCH /api/users/users/:id/unfollow', () => {
    it('should unfollow a user', async () => {
      // Create two users for testing
      const user1SignupResponse = await api.post('/api/users/signup').send({
        email: 'testi8@testi.com',
        password: 'R3g5T7#ghfR'
      });

      const user2SignupResponse = await api.post('/api/users/signup').send({
        email: 'testi9@testi.com',
        password: 'R3g5T7#ghfR'
      });

      const userToFollowId = user2SignupResponse.body.user._id;

      // Login with the first user to get the authentication token
      const loginResponse = await api.post('/api/users/login').send({
        username: 'Testi5',
        password: 'R3g5T7#ghfR'
      });

      const token = loginResponse.body.token;

      // Follow the user with the authentication token
      await api
        .patch(`/api/users/users/${userToFollowId}/follow`)
        .set('Authorization', `Bearer ${token}`);

      // Unfollow the user with the authentication token
      const response = await api
        .patch(`/api/users/users/${userToFollowId}/unfollow`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Unfollowed');
    });

    it('should return error if user to unfollow is not found', async () => {
      // Login with a user to get the authentication token
      const loginResponse = await api.post('/api/users/login').send({
        username: 'Testi5',
        password: 'R3g5T7#ghfR'
      });

      const token = loginResponse.body.token;

      // Unfollow a user with an invalid id
      const response = await api
        .patch('/api/users/users/invalid_id/unfollow')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User to unfollow not found');
    });
  });

});

afterAll(() => {
  mongoose.connection.close();
});
