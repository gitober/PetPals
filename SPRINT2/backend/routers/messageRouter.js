// This script configures an Express router for message-related operations, such as creating, fetching conversations, 
//getting messages, and deleting messages. Routes are secured with authentication middleware (authMiddleware), 
// and the router is linked to the messageController for execution.

const router = require("express").Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/message", authMiddleware, messageController.createMessage);
router.get("/conversations/:id", authMiddleware, messageController.getConversations);
router.get("/message/:id", authMiddleware, messageController.getMessages);
router.delete("/message/:id", authMiddleware, messageController.deleteMessages);

module.exports = router;