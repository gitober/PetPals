// This code defines Express routes for handling notifications, including creation, deletion, retrieval, marking as read, 
// and deleting all. Authentication middleware (authMiddleware) is used to secure the routes, and the router 
// connects to functions in notifyController for handling the logic.

const router = require("express").Router();
const notifyController = require("../controllers/notifyController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/notify", authMiddleware, notifyController.createnotify);
router.delete("/notify/:id", authMiddleware, notifyController.removenotify);
router.get("/notifies", authMiddleware, notifyController.getnotify);
router.delete("/deleteallnotify", authMiddleware, notifyController.deleteAllNotifies);
router.patch("/isreadnotify/:id", authMiddleware, notifyController.isreadNotify);

module.exports = router;