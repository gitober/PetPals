const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server"); // Adjust the path as needed
const Post = require("../models/postModel"); // Adjust the path as needed
const api = supertest(app);

// Set up and tear down
beforeAll(async () => setupDB());
afterAll(async () => tearDownDB());

describe('Post Model Tests', () => {
    let createdPostId;

    it('should create a new post', async () => {
        const newPost = {
            content: 'Test content',
            images: ['img1.jpg', 'img2.jpg'],
            user: {
                "username": "user1",
                "email": "User1@mail.com",
                "password": "[Hidden]",
                "story": "",
                "_id": "65eec9a25aae291a67377f3e",
                "following": [],
                "followers": [],
                "createdAt": "2024-03-11T09:06:42.148Z",
                "updatedAt": "2024-03-11T09:06:42.148Z",
                "__v": 0
            },
        };

        const response = await api.post('/api/posts').send(newPost).expect(201).expect('Content-Type', /json/);
        createdPostId = response.body._id;

        expect(response.body.content).toBe(newPost.content);
        expect(response.body.images.length).toBe(2);
    });

    it('should fetch a post', async () => {
        const response = await api.get(`/api/posts/${createdPostId}`).expect(200).expect('Content-Type', /json/);
        expect(response.body._id).toBe(createdPostId);
    });

    it('should update a post', async () => {
        const updatedContent = { content: 'Updated test content' };
        await api.put(`/api/posts/${createdPostId}`).send(updatedContent).expect(200);

        const response = await api.get(`/api/posts/${createdPostId}`);
        expect(response.body.content).toBe(updatedContent.content);
    });

    it('should delete a post', async () => {
        await api.delete(`/api/posts/${createdPostId}`).expect(204);
        const response = await api.get(`/api/posts/${createdPostId}`).expect(404);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
  });
  