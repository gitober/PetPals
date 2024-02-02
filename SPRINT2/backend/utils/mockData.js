// mockData.js

// For my group: Mock data is primarily used during the development and testing phases of a software project.
// It is a way to test the functionality of the application before the actual data is available.
// This file contains mock data for users, pets, posts, and comments.

const mockUsers = [
  {
    userId: 1,
    username: "petlover123",
    fullName: "John Doe",
    profilePicture: "https://example.com/john.jpg",
  },
  // Add more mock users as needed
];

const mockPets = [
  {
    id: 1,
    name: "Fluffy",
    species: "Cat",
    breed: "Persian",
    age: 3,
    ownerId: 1, // ID of the pet owner
    profilePicture: "https://example.com/fluffy.jpg",
  },
  // Add more mock pet profiles as needed
];

const mockPosts = [
  {
    postId: 101,
    userId: 1,
    caption: "Just chilling with Fluffy! 😺",
    imageUrl: "https://example.com/chilling.jpg",
    timestamp: new Date().toISOString(),
  },
  // Add more mock posts as needed
];

const mockComments = [
  {
    commentId: 1,
    postId: 101,
    userId: 2, // ID of the user who left the comment
    text: "Fluffy is adorable!",
    timestamp: new Date().toISOString(),
  },
  // Add more mock comments as needed
];

module.exports = { mockUsers, mockPets, mockPosts, mockComments };