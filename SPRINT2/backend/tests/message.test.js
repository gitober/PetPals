const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server"); // Adjust the path as needed
const Message = require("../models/messageModel"); // Adjust the path as needed
const api = supertest(app);

// Assuming setupDB and tearDownDB are defined to manage test DB lifecycle
beforeAll(async () => setupDB());
afterAll(async () => {
  await tearDownDB();
  await mongoose.connection.close();
});

describe('Message Model Tests', () => {
    let createdMessageId;

    it('should create a new message', async () => {
        const newMessage = {
            conversation: "60eec9a25aae291a67377f3e", // Example conversation ObjectId
            sender: "60eec9b25aae291a67377f4f", // Example sender ObjectId
            recipient: ["60eec9c25aae291a67377f5f"], // Example recipient ObjectId(s)
            text: "Hello, this is a test message",
            media: ["image1.jpg", "image2.jpg"],
        };

        const response = await api.post('/api/messages').send(newMessage).expect(201).expect('Content-Type', /json/);
        createdMessageId = response.body._id;

        expect(response.body.text).toBe(newMessage.text);
        expect(response.body.media.length).toBe(2);
    });

    it('should fetch a message', async () => {
        const response = await api.get(`/api/messages/${createdMessageId}`).expect(200).expect('Content-Type', /json/);
        expect(response.body._id).toBe(createdMessageId);
    });

    // Additional test cases for update and delete operations can be implemented similarly.
    // Below is an example for deleting a message.

    it('should delete a message', async () => {
        await api.delete(`/api/messages/${createdMessageId}`).expect(204);
        await api.get(`/api/messages/${createdMessageId}`).expect(404);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
  });