// post.js
const Post = require("./postModel.js");
const posts = [
  {
    username: "petlover1",
    caption: "My adorable pet in the sunshine!",
    image: "https://example.com/pet1.jpg",
    likes: 120,
    comments: [
      { username: "petfriend1", text: "So cute!" },
      { username: "petfriend2", text: "Is that a smile? 😊" },
      // More comments as needed
    ],
    timestamp: new Date("2022-02-01T10:15:00Z"),
  },
  {
    username: "animalfanatic",
    caption: "Playtime with my furry friend!",
    image: "https://example.com/pet2.jpg",
    likes: 80,
    comments: [
      { username: "petfriend3", text: "They look so happy!" },
      { username: "petfriend4", text: "Wish I could join! 🐾" },
      // More comments as needed
    ],
    timestamp: new Date("2022-01-30T15:45:00Z"),
  },
  {
    username: "petadventures",
    caption: "Exploring new places with my pet buddy!",
    image: "https://example.com/pet3.jpg",
    likes: 200,
    comments: [
      { username: "petfriend5", text: "Where is this beautiful place?" },
      { username: "petfriend6", text: "Adventures await! 🌳" },
      // More comments as needed
    ],
    timestamp: new Date("2022-01-28T18:30:00Z"),
  },
  // Additional posts
  {
    username: "petlover2",
    caption: "Chilling with my fluffy companion!",
    image: "https://example.com/pet4.jpg",
    likes: 150,
    comments: [
      { username: "petfriend7", text: "Looks so relaxing!" },
      { username: "petfriend8", text: "Can I join too? 😄" },
      // More comments as needed
    ],
    timestamp: new Date("2022-01-25T09:30:00Z"),
  },
  {
    username: "petenthusiast",
    caption: "Pet fashion show at home!",
    image: "https://example.com/pet5.jpg",
    likes: 180,
    comments: [
      { username: "petfriend9", text: "Stylish pets! 🐾" },
      { username: "petfriend10", text: "Where did you get those outfits?" },
      // More comments as needed
    ],
    timestamp: new Date("2022-01-22T14:15:00Z"),
  },
  {
    username: "petlover3",
    caption: "Lazy Sunday with my cuddly friend",
    image: "https://example.com/pet6.jpg",
    likes: 90,
    comments: [
      { username: "petfriend11", text: "Perfect way to spend the day!" },
      { username: "petfriend12", text: "I wish I had a pet like yours!" },
      // More comments as needed
    ],
    timestamp: new Date("2022-01-20T17:45:00Z"),
  },
  {
    username: "petexplorer",
    caption: "Discovering hidden treasures with my pet!",
    image: "https://example.com/pet7.jpg",
    likes: 220,
    comments: [
      { username: "petfriend13", text: "What an adventure!" },
      { username: "petfriend14", text: "Nature lovers! 🌲" },
      // More comments as needed
    ],
    timestamp: new Date("2022-01-18T11:30:00Z"),
  },
  {
    username: "petlover4",
    caption: "Sunset cuddles with my furry buddy",
    image: "https://example.com/pet8.jpg",
    likes: 130,
    comments: [
      { username: "petfriend15", text: "So heartwarming!" },
      { username: "petfriend16", text: "Best way to end the day." },
      // More comments as needed
    ],
    timestamp: new Date("2022-01-15T20:15:00Z"),
  },
  {
    username: "petentertainment",
    caption: "Pet talent show at home!",
    image: "https://example.com/pet9.jpg",
    likes: 300,
    comments: [
      { username: "petfriend17", text: "Incredible talents!" },
      { username: "petfriend18", text: "Can your pet do tricks too?" },
      // More comments as needed
    ],
    timestamp: new Date("2022-01-12T14:45:00Z"),
  },
  {
    username: "petlover5",
    caption: "Morning routine with my playful pet",
    image: "https://example.com/pet10.jpg",
    likes: 110,
    comments: [
      { username: "petfriend19", text: "Adorable morning vibes!" },
      { username: "petfriend20", text: "What a cute way to start the day." },
      // More comments as needed
    ],
    timestamp: new Date("2022-01-10T08:30:00Z"),
  },
  // Add more mock posts as needed
];

module.exports = { Post, posts };
