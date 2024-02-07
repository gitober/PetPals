# Project Directory Structure - in progress

/backend
  /config
    - db.js
  /controllers
    - authController.js
    - postController.js
    - userController.js
  /middleware
    - authMiddleware.js
    - errorHandler.js
    - notFoundMiddleware.js
    - rolesMiddleware.js
  /models
    - Post.js
    - postModel.js
    - User.js
    - userModel.js
  /routes
    - authRoutes.js
    - postRoutes.js
    - userRoutes.js
  /utils
    - mockData.js (old mockdata)
  /docs
    - api.md
  - server.js
  - .env
  - package.json


/backend: The main folder for your backend code.

/config: Configuration-related files.
db.js: Handles the database connection setup using Mongoose.

/controllers: Controllers handle the application logic for each route.
authController.js: Manages authentication-related functionality.
postController.js: Handles operations related to posts.
userController.js: Manages user-related operations.

/middleware: Contains middleware functions for request processing.
authMiddleware.js: Authenticates users before accessing certain routes.
errorHandler.js: Handles errors that occur during request processing.
notFoundMiddleware.js: Responds to requests for non-existing routes.
rolesMiddleware.js: Provides role-based access control for routes.

/models: Defines the data models using Mongoose schema.
Post.js: Mongoose schema for posts.
postModel.js: Mongoose model for posts.
User.js: Mongoose schema for users.
userModel.js: Mongoose model for users.

/routes: Defines API routes and connects them to controllers.
authRoutes.js: Routes related to authentication.
postRoutes.js: Routes related to posts.
userRoutes.js: Routes related to users.

/utils: Utility files or scripts.
mockData.js: Contains mock data (potentially for testing purposes).

/docs: Documentation-related files.
api.md: Markdown file containing API documentation.
server.js: The main entry point for your server application.

.env: Configuration file for environment variables.

package.json: File containing metadata and dependencies for the Node.js project.