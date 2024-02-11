// notifyController handles notification functionalities within a social platform. It includes operations for 
// creating notifications, removing specific notifications, fetching user notifications, marking notifications 
// as read, and deleting all notifications.The controller ensures proper handling of notifications, 
// considering user authentication and data retrieval.

const Notifies = require("../models/notifyModel");

const notifyController = {
  // Create a new notification
  createnotify: async (req, res) => {
    try {
      const { id, recipients, url, content, image, text, isRead } = req.body;

      if (recipients.includes(req.user._id.toString())) return;

      const notify = await new Notifies({
        id,
        recipients,
        url,
        content,
        image,
        text,
        isRead,
        user: req.user,
      });

      notify.save();
      return res.json({ notify });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // Remove a specific notification
  removenotify: async (req, res) => {
    try {
      const notify = await Notifies.findOneAndDelete({
        id: req.params.id,
        url: req.query.url,
      });

      return res.json({ notify });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // Get user's notifications
  getnotify: async (req, res) => {
    try {
      const notifies = await Notifies.find({
        recipients: req.user._id,
      })
        .sort("createdAt")
        .populate("user", "avatar fullname username");

      return res.json({ notifies });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // Mark a notification as read
  isreadNotify: async (req, res) => {
    try {
      const notifies = await Notifies.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        { isRead: true }
      );

      return res.json({ notifies });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // Delete all user's notifications
  deleteAllNotifies: async (req, res) => {
    try {
      const notifies = await Notifies.deleteMany({
        recipients: req.user._id,
      });

      return res.json({ notifies });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};

module.exports = notifyController;
