const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Comment = require("../models/commentModel");
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
  await Comment.deleteMany({});
  await Post.deleteMany({});
});

describe('Comment Controller', () => {
  describe('POST /api/comments', () => {
    it('should create a new comment', async () => {
      const post = await Post.create({ /* create a new post object */ });
      const response = await api
        .post('/api/comments')
        .send({
          content: 'Test comment',
          postId: post._id,
          postUserId: post.user,
          /* other necessary fields */
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('newComment');
      /* additional assertions as needed */
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('should update the content of a comment', async () => {
      const comment = await Comment.create({ /* create a new comment object */ });
      const response = await api
        .put(`/api/comments/${comment._id}`)
        .send({ content: 'Updated comment content' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Updated successfully');
      /* additional assertions as needed */
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should delete a comment', async () => {
      const comment = await Comment.create({ /* create a new comment object */ });
      const response = await api
        .delete(`/api/comments/${comment._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Comment deleted successfully!');
      /* additional assertions as needed */
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
