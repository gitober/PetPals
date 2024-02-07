// user.js
const User = require("./userModel.js");
const bcrypt = require("bcrypt"); // the bcrypt library is used for password hashing, install it using npm install bcrypt!!
const connectDB = require("./db");

connectDB();

const users = [
  {
    _id: "user1", // Unique identifier (MongoDB ObjectId)
    username: "petlover1",
    email: "petlover1@example.com",
    password: bcrypt.hashSync("password123", 10),
    profile: {
      name: "John Doe",
      bio: "Pet lover and adventurer",
      profileImage: "https://example.com/profile1.jpg",
    },
  },
  {
    _id: "user2",
    username: "animalfanatic",
    email: "animalfanatic@example.com",
    password: bcrypt.hashSync("password456", 10),
    profile: {
      name: "Jane Smith",
      bio: "Animal enthusiast and photographer",
      profileImage: "https://example.com/profile2.jpg",
    },
  },
  {
    _id: "user3",
    username: "natureexplorer",
    email: "natureexplorer@example.com",
    password: bcrypt.hashSync("password789", 10),
    profile: {
      name: "Alex Johnson",
      bio: "Explorer of the great outdoors",
      profileImage: "https://example.com/profile3.jpg",
    },
  },
  {
    _id: "user4",
    username: "furryfriend",
    email: "furryfriend@example.com",
    password: bcrypt.hashSync("passwordABC", 10),
    profile: {
      name: "Emma Davis",
      bio: "Dedicated to furry companions",
      profileImage: "https://example.com/profile4.jpg",
    },
  },
  // Add more advanced user data as needed
];

const seedUsersToDatabase = async () => {
  try {
    await User.create(users);
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error.message);
  }
};

module.exports = { User, seedUsersToDatabase };
