const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Post = require("../models/postModel");

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
});

afterEach(async () => {
  await Post.deleteMany({});
});

describe('Post Controller', () => {
  describe('GET /api/posts', () => {
    it('should get all posts', async () => {
      /* Insert some sample posts into the test database */
      const response = await api.get('/api/posts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(/* expected number of posts */);
      /* additional assertions as needed */
    });
  });

  describe('POST /api/posts', () => {
    it('should add a new post', async () => {
      const response = await api
        .post('/api/posts')
        .send({
          content: 'Test post content',
          images: ['image1.jpg', 'image2.jpg'],
          /* other necessary fields */
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(/* expected properties of the new post */);
      /* additional assertions as needed */
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should get a post by ID', async () => {
      /* Insert a sample post into the test database */
      const post = await Post.create({ /* post data */ });

      const response = await api.get(`/api/posts/${post._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(/* expected properties of the post */);
      /* additional assertions as needed */
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update a post by ID', async () => {
      /* Insert a sample post into the test database */
      const post = await Post.create({ /* post data */ });

      const response = await api
        .put(`/api/posts/${post._id}`)
        .send({ /* updated post data */ });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(/* expected properties of the updated post */);
      /* additional assertions as needed */
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post by ID', async () => {
      /* Insert a sample post into the test database */
      const post = await Post.create({ /* post data */ });

      const response = await api.delete(`/api/posts/${post._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Post deleted successfully');
      /* additional assertions as needed */
    });
  });

  describe('POST /api/posts/:id/like', () => {
    it('should like a post by ID', async () => {
      /* Insert a sample post into the test database */
      const post = await Post.create({ /* post data */ });

      const response = await api.post(`/api/posts/${post._id}/like`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(/* expected properties of the liked post */);
      /* additional assertions as needed */
    });
  });

  describe('POST /api/posts/:id/unlike', () => {
    it('should unlike a post by ID', async () => {
      /* Insert a sample post into the test database */
      const post = await Post.create({ /* post data */ });

      const response = await api.post(`/api/posts/${post._id}/unlike`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(/* expected properties of the unliked post */);
      /* additional assertions as needed */
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
