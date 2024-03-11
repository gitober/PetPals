const Messages = require("../models/messageModel");
const Conversations = require("../models/conversationModel");

const messageController = {
  // Create a new message in a conversation
  createMessage: async (req, res) => {
    try {
      // Extract message details from request body
      const { recipient, text, media } = req.body;

      // Validate recipient and message content
      if (!recipient || (!text.trim() && media.length === 0)) return;

      // Find or create a conversation with the given recipients
      const newConversation = await Conversations.findOneAndUpdate(
        {
          $or: [
            { recipients: [req.user._id, recipient] },
            { recipients: [recipient, req.user._id] },
          ],
        },
        {
          recipients: [req.user._id, recipient],
          text,
          media,
        },
        {
          new: true,
          upsert: true,
        }
      );

      // Create a new message in the conversation
      const newMessage = new Messages({
        conversation: newConversation._id,
        sender: req.user._id,
        recipient,
        text,
        media,
      });

      await newMessage.save();

      // Respond with the new conversation
      res.json({ newConversation });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Get user's conversations
  getConversations: async (req, res) => {
    try {
      // Find conversations where the user is a recipient
      const conversation = await Conversations.find({
        recipients: req.user._id,
      })
        .sort("updatedAt")
        .populate("recipients", "avatar fullname username");

      // Respond with the list of conversations
      res.json({
        conversation,
        result: conversation.length,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Get messages in a specific conversation
  getMessages: async (req, res) => {
    try {
      // Find messages in a conversation between the user and the specified recipient
      const message = await Messages.find({
        $or: [
          {
            sender: req.user._id,
            recipient: req.params.id,
          },
          {
            sender: req.params.id,
            recipient: req.user._id,
          },
        ],
      })
        .sort("-createdAt")
        .populate("recipients", "avatar fullname username");

      // Respond with the list of messages
      res.json({
        message,
        result: message.length,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Delete a specific message
  deleteMessages: async (req, res) => {
    try {
      // Find and delete the message based on user ownership
      await Messages.findOneAndDelete({
        _id: req.params.id,
        sender: req.user._id,
      });

      // Respond with success message
      res.json({ message: "Message deleted" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = messageController;
