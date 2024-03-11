const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server"); // Adjust the path as needed
const Notify = require("../models/notifyModel"); // Adjust the path as needed
const api = supertest(app);

// Assuming you have these utilities for DB setup and teardown
beforeAll(async () => setupDB());
afterAll(async () => {
  await tearDownDB();
  await mongoose.connection.close();
});

describe('Notification Model Tests', () => {
    let createdNotifyId;

    it('should create a new notification', async () => {
        const newNotification = {
            user: "65eec9a25aae291a67377f3e", // Example user ObjectId
            recipients: ["65eec9b25aae291a67377f4f"], // Example recipient ObjectIds
            url: '/some-url-path',
            content: 'Notification content',
            image: 'notification-img.jpg',
            text: 'Notification text',
        };

        const response = await api.post('/api/notifications').send(newNotification).expect(201).expect('Content-Type', /json/);
        createdNotifyId = response.body._id;

        expect(response.body.content).toBe(newNotification.content);
        expect(response.body.text).toBe(newNotification.text);
    });

    it('should fetch a notification', async () => {
        const response = await api.get(`/api/notifications/${createdNotifyId}`).expect(200).expect('Content-Type', /json/);
        expect(response.body._id).toBe(createdNotifyId);
    });

    it('should update a notification', async () => {
        const updatedData = { content: 'Updated notification content', isRead: true };
        await api.put(`/api/notifications/${createdNotifyId}`).send(updatedData).expect(200);

        const response = await api.get(`/api/notifications/${createdNotifyId}`);
        expect(response.body.content).toBe(updatedData.content);
        expect(response.body.isRead).toBe(true);
    });

    it('should delete a notification', async () => {
        await api.delete(`/api/notifications/${createdNotifyId}`).expect(204);
        const response = await api.get(`/api/notifications/${createdNotifyId}`).expect(404);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
  });
  