const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server"); // Adjust the path as needed
const Comment = require("../models/commentModel"); // Adjust the path as needed
const api = supertest(app);

// Assuming setupDB and tearDownDB are defined to manage test DB lifecycle
beforeAll(async () => setupDB());
afterAll(async () => {
  await tearDownDB();
  await mongoose.connection.close();
});

describe('Comment Model Tests', () => {
    let createdCommentId;

    it('should create a new comment', async () => {
        const newComment = {
            content: "This is a test comment",
            tag: { username: "testuser", userId: "60eec9b25aae291a67377f4f" }, // Example tagging info
            reply: undefined, // Assuming it's a top-level comment
            user: "60eec9a25aae291a67377f3e", // Example user ObjectId
            postId: "60eed9c25aae291a67377f5f", // Example post ObjectId
            postUserId: "60eec9b25aae291a67377f4f", // Example post creator ObjectId
        };

        const response = await api.post('/api/comments').send(newComment).expect(201).expect('Content-Type', /json/);
        createdCommentId = response.body._id;

        expect(response.body.content).toBe(newComment.content);
        // Validate other fields as needed
    });

    it('should fetch a comment', async () => {
        const response = await api.get(`/api/comments/${createdCommentId}`).expect(200).expect('Content-Type', /json/);
        expect(response.body._id).toBe(createdCommentId);
        // Perform additional validations as needed
    });

    // Example test for updating a comment
    it('should update a comment', async () => {
        const updatedContent = { content: 'Updated comment content' };
        await api.put(`/api/comments/${createdCommentId}`).send(updatedContent).expect(200);

        const response = await api.get(`/api/comments/${createdCommentId}`);
        expect(response.body.content).toBe(updatedContent.content);
    });

    it('should delete a comment', async () => {
        await api.delete(`/api/comments/${createdCommentId}`).expect(204);
        await api.get(`/api/comments/${createdCommentId}`).expect(404);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
  });