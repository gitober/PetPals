# Project Directory Structure - in progress

/backend
  /config
    - db.js
  /controllers
    - authController.js
    - commentController.js
    - messageController.js
    - notifyController.js
    - postController.js
    - userController.js
  /middleware
    - authMiddleware.js
    - errorHandler.js
    - notFound.js
  /models
    - commentModel.js
    - conversationModel.js
    - messageModel.js
    - notifyModel.js
    - postModel.js
    - userModel.js
  /routers
    - authRouter.js
    - commentRouter.js
    - messageRouter.js
    - notifyRouter.js
    - postRouter.js
    - userRouter.js
  /utils_old_mockdata
    - mockData.js (old mockdata)
  /docs
    - commands
    - folders.md
    - postman.md
- .env
- .gitignore
- package-lock.json
- package.json
- server.js
- socketServer.js

# config:
Contains configuration files for the application.
db.js: Manages the connection to MongoDB.

# controllers:
Holds controllers that handle business logic for different entities in your application.
Files: authController, commentController, messageController, notifyController, postController, userController.

# middleware:
Stores middleware functions that can be applied to routes.
Files: authMiddleware, errorHandler, notFound.

# models:
Contains Mongoose models for MongoDB data structures.
Files: commentModel, conversationModel, messageModel, notifyModel, postModel, userModel.

# routers:
Holds route handlers for different entities.
Files: authRouter, commentRouter, messageRouter, notifyRouter, postRouter, userRouter.

# utils_old_mockdata:
Deprecated folder for old mock data utility.
File: mockData.js (old mock data).

# docs:
Stores documentation related to your project.
Files: apitest.md, commands, foldertest.md.

# Other Files:
.env: Environment variables configuration file (contains MONGO_URI, ACCESSTOKENSECRET and REFRESHTOKENSECRET)
.gitignore: Specifies files and directories that should be ignored by version control.
package-lock.json: Lock file for npm dependencies.
package.json: Configuration file for npm packages.
server.js: Main file for running the Express server.

socketServer.js: THIS WILL BE ADDED LATER - Manages socket connections for real-time communication. 