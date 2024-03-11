const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server"); // Ensure this path matches your app's structure
const User = require("../models/userModel"); // Ensure the path matches your structure
const api = supertest(app);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("User operations", () => {
  let token;
  beforeAll(async () => {
    // Assuming your signup endpoint works as expected and returns a token
    const newUser = {
      username: "initialUser",
      email: "initial@example.com",
      password: "password123",
    };

    const response = await api
      .post("/api/users/signup")
      .send(newUser);

    token = response.body.token; // Adjust according to your response structure
  });

  it("should create a new user with valid details", async () => {
    const newUser = {
      username: "testUser",
      email: "testUser@example.com",
      password: "password",
      story: "This is a test story",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // Verify some aspects of the response if needed
    expect(response.body.username).toBe(newUser.username);
  });

  it("should update user story", async () => {
    const updatedInfo = { story: "Updated test story" };
    const users = await User.find({});
    const user = users[0]; // Get the first user

    await api
      .put(`/api/users/${user._id}/update`) // Ensure this matches your actual endpoint
      .set("Authorization", `Bearer ${token}`)
      .send(updatedInfo)
      .expect(200);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.story).toBe(updatedInfo.story);
  });

  it("should allow a user to follow another user", async () => {
    // Assuming there are two users: one to follow and one that follows
    const userToFollow = await User.findOne({ username: "initialUser" });
    const followerUser = new User({
      username: "followerUser",
      email: "follower@example.com",
      password: "password",
    });
    await followerUser.save();

    await api
      .put(`/api/users/${followerUser._id}/follow`) // Adjust to match your actual endpoint
      .set("Authorization", `Bearer ${token}`)
      .send({ userIdToFollow: userToFollow._id })
      .expect(200);

    const updatedFollowerUser = await User.findById(followerUser._id).populate('following.user');
    const followedUserIds = updatedFollowerUser.following.map(follow => follow.user._id.toString());
    expect(followedUserIds).toContain(userToFollow._id.toString());
  });
});

afterAll(async () => {
    await mongoose.connection.close();
  });
  