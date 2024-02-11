// Mongoose schema for comments with fields like user, content, tag, reply, postUserId, and postId. 
// It establishes relationships with other models. The schema includes timestamps and is exported as 
// the "comment" model for MongoDB operations.

const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comment", commentSchema);
