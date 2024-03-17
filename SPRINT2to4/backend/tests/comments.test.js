const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Comment = require("../models/commentModel");
const User = require("../models/userModel");

beforeAll(async () => {
  await User.deleteMany({});
  await Comment.deleteMany({});
});

describe("Comment Routes", () => {
  let token = null;
  let postId = null;

  beforeAll(async () => {
    const user = {
      username: "testuser",
      email: "testi@testi.com",
      password: "R3g5T7#gh",
    };
    const response = await api.post("/api/users/signup").send(user);
    token = response.body.token;

    const post = {
      content: "Test post content",
      image: "test_image.jpg",
    };
    const postResponse = await api
      .post("/api/posts")
      .set("Authorization", "bearer " + token)
      .send(post);
    postId = postResponse.body._id;
  }); 

  it("should return all comments as JSON when GET /api/posts/:postId/comments is called", async () => {
    const response = await api
      .get(`/api/posts/${postId}/comments`)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should create one comment when POST /api/posts/:postId/comments is called", async () => {
    const newComment = {
      post_id: postId,
      username: "testuser",
      content: "Test comment content",
    };
    await api
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", "bearer " + token)
      .send(newComment)
      .expect(201);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
