// Mongoose schema for notifications with fields such as id, user, recipients, url, content, image, text, and isRead. 
// It establishes a relationship with the "user" model using ObjectId references. The schema includes timestamps 
// and is exported as the "notify" model for MongoDB operations.

const mongoose = require("mongoose");

const notifySchema = mongoose.Schema(
  {
    id: { type: mongoose.Types.ObjectId },
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    recipients: [mongoose.Types.ObjectId],
    url: String,
    content: String,
    image: String,
    text: String,
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("notify", notifySchema);
