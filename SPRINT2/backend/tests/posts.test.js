const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Post = require("../models/postModel"); 

// Sample test posts
const posts = [
  {
    content: "First post content",
    image: "image_url_1.jpg"
  },
  {
    content: "Second post content",
    image: "image_url_2.jpg"
  }
];

let token = null;

beforeAll(async () => {
  // Clear user collection and register a user to obtain token
  await User.deleteMany({});
  const result = await api
    .post("/api/users/signup")
    .send({ username: "mattitesti", email: "mattiv@matti.fi", password: "R3g5T7#gh" });
  token = result.body.token;
});

describe("Post Routes", () => {
  beforeEach(async () => {
    // Clear post collection and add test posts
    await Post.deleteMany({});
    await Promise.all(posts.map(post =>
      api
        .post("/api/posts") 
        .set("Authorization", "bearer " + token)
        .send(post)
    ));
  });

  it("should return all posts as JSON when GET /api/posts is called", async () => {
    await api
      .get("/api/posts")
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should create one post when POST /api/posts is called", async () => {
    const newPost = {
      content: "Test Post Content",
      image: "test_image.jpg"
    };
    await api
      .post("/api/posts")
      .set("Authorization", "bearer " + token)
      .send(newPost)
      .expect(201);
  });
  
  it("should return one post by ID when GET /api/posts/:id is called", async () =>  {
    const post = await Post.findOne();
    await api
      .get("/api/posts/" + post._id)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should update one post by ID when PUT /api/posts/:id is called", async () => {
    const post = await Post.findOne();
    const updatedPost = {
      content: "Updated Post Content",
      image: "updated_image.jpg"
    };
    await api
      .put("/api/posts/" + post._id)
      .set("Authorization", "bearer " + token)
      .send(updatedPost)
      .expect(200);
    const updatedPostCheck = await Post.findById(post._id);
    expect(updatedPostCheck.toJSON()).toEqual(expect.objectContaining(updatedPost));
  });

  it("should delete one post by ID when DELETE /api/posts/:id is called", async () => {
    const post = await Post.findOne();
    await api
      .delete("/api/posts/" + post._id)
      .set("Authorization", "bearer " + token)
      .expect(200);
    const postCheck = await Post.findById(post._id);
    expect(postCheck).toBeNull();
  });
});

afterAll(async () => {
  // Close database connection after all tests are done
  await mongoose.connection.close();
});
