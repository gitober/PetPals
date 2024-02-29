// This code sets up Express routes for user-related operations, including searching for users, retrieving user details, 
// updating user information, and managing friend connections. Authentication middleware (authMiddleware) secures 
// the routes, and the router connects to functions in userController for implementing the logic.

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/users", authMiddleware, userController.getAllUsers);
router.get("/search", authMiddleware, userController.searchUsers);
router.get("/user/:id", authMiddleware, userController.getUser);
router.patch("/user", authMiddleware, userController.updateUser);
router.patch("/user/:id/follow", authMiddleware, userController.followUser);
router.patch("/user/:id/unfollow", authMiddleware, userController.unfollowUser);

module.exports = router;