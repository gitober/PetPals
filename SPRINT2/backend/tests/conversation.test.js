const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server"); // Adjust the path as needed
const Conversation = require("../models/conversationModel"); // Adjust the path as needed
const api = supertest(app);

// Assuming setupDB and tearDownDB are defined to manage test DB lifecycle
beforeAll(async () => setupDB());
afterAll(async () => {
  await tearDownDB();
  await mongoose.connection.close();
});

describe('Conversation Model Tests', () => {
    let createdConversationId;

    it('should create a new conversation', async () => {
        const newConversation = {
            recipients: ["60eec9a25aae291a67377f3e", "60eec9b25aae291a67377f4f"], // Example user ObjectId(s)
            text: "Initial conversation message",
            media: ["conversationImage1.jpg"],
        };

        const response = await api.post('/api/conversations').send(newConversation).expect(201).expect('Content-Type', /json/);
        createdConversationId = response.body._id;

        expect(response.body.text).toBe(newConversation.text);
        expect(response.body.recipients.length).toBe(2);
        expect(response.body.media.length).toBe(1);
    });

    it('should fetch a conversation', async () => {
        const response = await api.get(`/api/conversations/${createdConversationId}`).expect(200).expect('Content-Type', /json/);
        expect(response.body._id).toBe(createdConversationId);
    });

    // Implement more tests as needed, such as updating conversation data or testing specific functionalities related to conversations.
    
    // Example test for deleting a conversation
    it('should delete a conversation', async () => {
        await api.delete(`/api/conversations/${createdConversationId}`).expect(204);
        await api.get(`/api/conversations/${createdConversationId}`).expect(404);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
  });