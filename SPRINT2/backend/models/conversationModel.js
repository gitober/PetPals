// Mongoose schema for conversations with fields like recipients, text, and media. It establishes relationships 
// with the "user" model using ObjectId references. The schema includes timestamps and is exported 
// as the "conversation" model for MongoDB operations.

const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    recipients: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    text: String,
    media: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("conversation", conversationSchema);