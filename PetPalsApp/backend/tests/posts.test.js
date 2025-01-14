const supertest = require("supertest");
const express = require("express");
const app = express();
const Post = require("../models/postModel");
const User = require("../models/userModel");

jest.mock("../models/postModel"); // Mock Post model
jest.mock("../models/userModel"); // Mock User model

// Mock authentication middleware
jest.mock("../middleware/requireAuth", () => {
  return (req, res, next) => {
    req.user = { _id: "mockedUserId" };
    next();
  };
});

const api = supertest(app);

// Middlewares and routes
app.use(express.json());
app.use("/api/posts", require("../routers/postRouter"));

describe("Post Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for creating a post
  describe("POST /api/posts", () => {
    it("should create a post without an image", async () => {
      Post.create.mockResolvedValue({
        _id: "mockPostId",
        content: "This is a test post without an image",
        image: null,
        user_id: "mockedUserId",
        populate: jest.fn().mockResolvedValue({
          _id: "mockPostId",
          content: "This is a test post without an image",
          image: null,
          user_id: "mockedUserId",
          user: { username: "mockedUsername" },
          toObject: jest.fn().mockReturnValue({
            _id: "mockPostId",
            content: "This is a test post without an image",
            image: null,
            user_id: "mockedUserId",
            user: { username: "mockedUsername" },
          }),
        }),
      });

      const response = await api
        .post("/api/posts")
        .send({ content: "This is a test post without an image" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("content", "This is a test post without an image");
      expect(response.body.image).toBeNull();
    });
  });

  // Test for fetching all posts
  describe("GET /api/posts", () => {
    it("should fetch all posts", async () => {
      // Mock `Post.find` to support chaining
      const mockSort = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue([
            {
              _id: "mockPostId",
              content: "This is a test post",
              image: null,
              user_id: { _id: "mockedUserId", username: "mockedUsername" },
              likes: [],
              toObject: jest.fn().mockReturnValue({
                _id: "mockPostId",
                content: "This is a test post",
                image: null,
                user_id: { _id: "mockedUserId", username: "mockedUsername" },
                likes: [],
              }),
            },
          ]),
        }),
      });
      Post.find.mockImplementation(() => ({
        sort: mockSort,
      }));
  
      const response = await api.get("/api/posts");
  
      console.log("Fetched Posts Response:", response.body);
  
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("content", "This is a test post");
      expect(response.body[0].image).toBeNull();
    });
  });
  
  // Test for fetching posts by a specific user
  describe("GET /api/posts/:id", () => {
    it("should fetch a specific post by ID", async () => {
      Post.findById.mockResolvedValue({
        _id: "mockPostId",
        content: "This is a test post",
        image: null,
        user_id: "mockedUserId",
        likes: [],
        toObject: jest.fn().mockReturnValue({
          _id: "mockPostId",
          content: "This is a test post",
          image: null,
          user_id: "mockedUserId",
          likes: [],
        }),
      });

      const response = await api.get("/api/posts/mockPostId");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("content", "This is a test post");
    });

    it("should return 404 if the post is not found", async () => {
      Post.findById.mockResolvedValue(null);

      const response = await api.get("/api/posts/invalidPostId");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Post not found");
    });
  });

  // Test for deleting a post
  describe("DELETE /api/posts/:postId", () => {
    it("should delete a post by ID", async () => {
      Post.findOneAndDelete.mockResolvedValue({
        _id: "mockPostId",
        content: "This is a test post",
        image: null,
      });

      const response = await api.delete("/api/posts/mockPostId");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Post deleted successfully");
    });

    it("should return 404 if the post is not found", async () => {
      Post.findOneAndDelete.mockResolvedValue(null);

      const response = await api.delete("/api/posts/invalidPostId");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Post not found or unauthorized");
    });
  });

  // Test for liking a post
  describe("POST /api/posts/:postId/like", () => {
    it("should toggle like on a post", async () => {
      const mockPost = {
        _id: "mockPostId",
        likes: ["mockedUserId"],
        save: jest.fn(),
      };

      Post.findById.mockResolvedValue(mockPost);

      const response = await api.post("/api/posts/mockPostId/like");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("postId", "mockPostId");
      expect(response.body).toHaveProperty("likesCount");
      expect(response.body).toHaveProperty("isLiked", false);
    });
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});
