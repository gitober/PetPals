const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  content: { type: String },
  images: { type: Array, required: true },
  likes: { type: Array },
  comments: { type: Array },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  postId: { type: String, required: true },
});

module.exports = mongoose.model('Post', postSchema);