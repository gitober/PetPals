// Mongoose schema for posts with fields such as content, images, likes, comments, and user. The schema establishes 
// relationships with the "user" and "comment" models using ObjectId references. It includes timestamps and is 
// exported as the "post" model for MongoDB operations. 

const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    content: String,
    images: {
      type: Array,
      required: true,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    commentss: [{ type: mongoose.Types.ObjectId, ref: "comment" }],
    user: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", postSchema);
