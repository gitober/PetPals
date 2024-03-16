const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  postId: { type: String, required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  timestamps: { type: Date, default: Date.now },
  });

module.exports = mongoose.model("Comment", commentSchema);
