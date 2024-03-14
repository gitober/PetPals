const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    content: String,
    images: {
      type: Array,
      required: true,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    postId: {
      type: Number,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", postSchema);