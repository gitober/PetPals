// Mongoose schema for messages with fields like conversation, sender, recipient, text, and media. 
// It establishes relationships with other models ("conversation" and "user"). The schema includes 
// timestamps and is exported as the "message" model for MongoDB operations.

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Types.ObjectId, ref: "conversation" },
    sender: { type: mongoose.Types.ObjectId, ref: "user" },
    recipient: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    text: String,
    media: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", messageSchema);
