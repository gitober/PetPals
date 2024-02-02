// mockData.js
const mockPets = [
  {
    id: 1,
    name: "Fluffy",
    species: "Cat",
    breed: "Persian",
    age: 3,
    owner: "petlover123",
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

module.exports = { mockPets, mockPosts };
