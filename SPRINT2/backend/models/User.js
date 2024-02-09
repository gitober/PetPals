require("dotenv").config();
const mongoose = require("mongoose");
const { seedUsersToDatabase } = require("./userModel");
const bcrypt = require("bcrypt");

const MONGO_URI = process.env.MONGO_URI;

const seedUsers = [
  {
    _id: "uniqueID1",
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
    _id: "uniqueID2",
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
    _id: "uniqueID3",
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
    _id: "uniqueID4",
    username: "furryfriend",
    email: "furryfriend@example.com",
    password: bcrypt.hashSync("passwordABC", 10),
    profile: {
      name: "Emma Davis",
      bio: "Dedicated to furry companions",
      profileImage: "https://example.com/profile4.jpg",
    },
  },
  {
    _id: "uniqueID5",
    username: "adventurelover",
    email: "petfriendly@example.com",
    password: bcrypt.hashSync("passwordXXX", 10),
    profile: {
      name: "Larry Month",
      bio: "Dedicated to adventurous life",
    },
  },
  // Add more advanced user data as needed
];

const seedUsersAndCloseConnection = async () => {
  try {
    console.log("MONGO_URI:", MONGO_URI); // Print MONGO_URI for debugging
    await mongoose.connect(MONGO_URI);

    // Seed users and get existing usernames
    const existingUsernames = await seedUsersToDatabase(seedUsers);

    // Handle Duplicates: Filter out existing usernames
    const newUsers = seedUsers.filter(
      (user) => !existingUsernames.includes(user.username)
    );

    if (newUsers.length > 0) {
      // Insert new users into the database
      await seedUsersToDatabase(newUsers);
      console.log(`${newUsers.length} new users seeded successfully`);
    } else {
      console.log("No new users to seed");
    }
  } catch (error) {
    console.error("Error seeding users:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Call the seeding function
seedUsersAndCloseConnection();
