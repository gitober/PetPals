const supertest = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

jest.mock("../models/commentModel"); // Mock Comment model
jest.mock("../models/postModel"); // Mock Post model

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
app.use("/api/comments", require("../routers/commentRouter"));

describe("Comment Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const postId = new mongoose.Types.ObjectId().toString();
  const commentId = new mongoose.Types.ObjectId().toString();

  // Test the get all comments
  describe("GET /api/comments", () => {
    it("should return all comments for a post", async () => {
      Comment.find.mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([
            {
              _id: commentId,
              content: "Test comment",
              postId,
              user_id: { _id: "mockedUserId", username: "mockedUsername" },
            },
          ]),
        }),
      }));

      const response = await api.get(`/api/comments?postId=${postId}`).expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("content", "Test comment");
    });

    it("should return 400 for invalid postId format", async () => {
      const response = await api.get("/api/comments?postId=invalidPostId").expect(400);
      expect(response.body.error).toBe("Invalid or missing postId");
    });
  });

  // Test the post comment
  describe("POST /api/comments", () => {
    it("should create a comment", async () => {
      // Mock `Comment.create` to return a valid response
      Comment.create.mockResolvedValueOnce({
        _id: commentId,
        content: "Test comment",
        postId,
        user_id: "mockedUserId",
      });
  
      // Simulate `populate` for the created comment
      Comment.findById.mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValueOnce({
          _id: commentId,
          content: "Test comment",
          postId,
          user_id: { _id: "mockedUserId", username: "mockedUsername" },
        }),
      }));
  
      const response = await api
        .post("/api/comments")
        .send({ content: "Test comment", postId })
        .expect(201);
  
      console.log("Response Body:", response.body); // Debugging response structure
  
      expect(response.body).toHaveProperty("content", "Test comment");
      expect(response.body).toHaveProperty("postId", postId);
      expect(response.body.user_id).toHaveProperty("username", "mockedUsername");
    });
  });
  
  // Test the delete comment
  describe("DELETE /api/comments/:commentId", () => {
    it("should delete a comment by the post owner", async () => {
      Comment.findById.mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce({
            _id: commentId,
            postId,
            user_id: { _id: "mockedUserId" },
          }),
        }),
      }));

      Post.findById.mockResolvedValueOnce({
        _id: postId,
        user_id: "mockedUserId",
      });

      Comment.findByIdAndDelete.mockResolvedValueOnce({
        _id: commentId,
        postId,
        user_id: "mockedUserId",
      });

      const response = await api.delete(`/api/comments/${commentId}`).expect(200);

      expect(response.body.message).toBe("Comment deleted successfully");
    });

    it("should return 403 if a non-owner tries to delete a comment", async () => {
      Comment.findById.mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce({
            _id: commentId,
            postId,
            user_id: { _id: "mockedUserId" },
          }),
        }),
      }));

      Post.findById.mockResolvedValueOnce({
        _id: postId,
        user_id: "anotherUserId",
      });

      const response = await api.delete(`/api/comments/${commentId}`).expect(403);

      expect(response.body.error).toBe("Unauthorized: Only the post owner can delete comments");
    });

    it("should return 400 for invalid commentId format", async () => {
      const response = await api.delete("/api/comments/invalidCommentId").expect(400);
      expect(response.body.error).toBe("Invalid commentId format");
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
