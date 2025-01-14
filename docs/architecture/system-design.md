# System Design

## Contents
- [Overview](#overview)
- [Application Layers](#application-layers)
  - [Backend](#backend)
    - [Framework and Middleware](#framework-and-middleware)
    - [Controllers](#controllers)
    - [Utilities](#utilities)
    - [Database](#database)
  - [Frontend](#frontend)
    - [Framework and Components](#framework-and-components)
    - [Pages](#pages)
    - [Styling](#styling)
  - [Database](#database)
    - [Structure](#structure)
    - [Features](#features)
- [Image Storage](#image-storage)
  - [Current Implementation](#current-implementation)
  - [Alternative for Production](#alternative-for-production)
  - [Migration Example (to Amazon S3)](#migration-example-to-amazon-s3)
- [Interaction Between Components](#interaction-between-components)

---

## Overview
The system adopts a modular architecture, integrating a **React frontend**, a **Node.js/Express backend**, and **MongoDB** for database persistence. This structure ensures scalability, maintainability, and efficiency in managing application functionalities. Below are the major components of the architecture:

## Application Layers

---

### Backend
#### **Framework and Middleware**:
- **Framework**: Node.js with Express manages API endpoints and middleware logic.
- **Middleware**:
  - **Security**: Helmet for secure HTTP headers, rate limiting to prevent DDoS attacks, and CORS for cross-origin requests.
  - **Authentication**: JSON Web Tokens (JWT) for session management and bcrypt for password hashing.
  - **Error Handling**: Centralized middleware for managing validation, authentication, and server errors.

#### **Controllers**:
- **Comment Controller**:
  - Fetches, adds, and deletes comments with proper authorization.
- **Post Controller**:
  - Manages CRUD operations for posts and handles like/unlike functionality.
- **User Controller**:
  - Handles user registration, login, profile updates, and follow/unfollow actions.

#### **Utilities**:
- **Token Management**: Functions for creating and refreshing JWT tokens.
- **Image Processing**: Utilities for formatting image URLs and handling file uploads securely.
- **Logging**: Consistent logging for debugging and monitoring.

#### **Database**:
- **Connection**: MongoDB integration using Mongoose for schema and query management.
- **Models**:
  - **User**: Manages user data including credentials, followers, and profile settings.
  - **Post**: Manages post data with references to likes, comments, and tags.
  - **Comment**: Handles comments associated with posts.

<p align="right">(<a href="#contents">back to top</a>)</p>

---

### Frontend
#### **Framework and Components**:
- **Framework**: React with modern JavaScript for a dynamic, interactive user interface.
- **Features**:
  - **Authentication**: Manages login, signup, and secure access using tokens.
  - **Dynamic Updates**: Implements like/unlike, follow/unfollow, and real-time search functionality.
  - **Responsive Design**: Ensures compatibility across devices.

#### **Pages**:
- **Login and Signup**: Includes validation and secure access token handling.
- **Home Feed**: Displays posts with like and comment functionality.
- **Profile**: Manages user profile data and displays user posts.
- **Settings**: Enables editing profile and updating credentials.
- **Search**: Real-time user and content search with dynamic results.

#### **Styling**:
- **CSS Modules**: Scoped styles for each component.
- **Global Themes**: Consistent UI design across the application.

<p align="right">(<a href="#contents">back to top</a>)</p>

---

### Database
#### **Structure**:
- **Collections**:
  - **Users**: Stores user credentials, bio, profile picture, followers, and following data.
  - **Posts**: Contains posts with references to likes and comments.
  - **Comments**: Includes content and references to associated posts and users.

#### **Features**:
- Implements indexes for efficient querying (e.g., user-specific posts or comments by post ID).
- Enforces data validation through Mongoose schemas.

<p align="right">(<a href="#contents">back to top</a>)</p>

---

## Image Storage
### Current Implementation
The application uses **Multer** for image storage. Files are stored locally in an `uploads` directory with the following configuration:

- **Storage**:
  - Creates the `uploads` directory if it does not exist.
  - Saves files with unique names to prevent conflicts.
- **Validation**:
  - Accepts only `.jpeg`, `.jpg`, and `.png` formats.
  - Validates file extensions and MIME types.

### Alternative for Production
For better scalability and reliability in production environments, consider using cloud-based storage services such as:
- **Amazon S3**:
  - Highly scalable and secure object storage.
  - Integrates seamlessly with Node.js using AWS SDK.
- **Cloudinary**:
  - Optimized for media storage and delivery.
  - Provides built-in image transformation and optimization tools.
- **Google Cloud Storage**:
  - Secure and high-performance storage solution.
  - Offers easy integration with Node.js through Google Cloud client libraries.

### Migration Example (to Amazon S3):
1. **Install AWS SDK**:
   ```bash
   npm install aws-sdk
   ```
2. **Configure S3 Bucket**:
   - Create a bucket on Amazon S3.
   - Configure access keys and permissions.
3. **Update Multer Configuration**:
   - Replace local storage with an S3 storage adapter like `multer-s3`.
   ```javascript
   const multerS3 = require('multer-s3');
   const aws = require('aws-sdk');

   aws.config.update({
     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
     region: process.env.AWS_REGION,
   });

   const s3 = new aws.S3();

   const upload = multer({
     storage: multerS3({
       s3,
       bucket: 'your-bucket-name',
       acl: 'public-read',
       key: (req, file, cb) => {
         cb(null, `${Date.now()}-${file.originalname}`);
       },
     }),
   });
   module.exports = upload;
   ```

<p align="right">(<a href="#contents">back to top</a>)</p>

---

## Interaction Between Components
1. **Frontend to Backend**:
   - React frontend communicates with the backend via RESTful API calls.
2. **Backend to Database**:
   - Express routes utilize service and controller layers to fetch or update data in MongoDB.
3. **Database to Frontend**:
   - Data is retrieved, processed, and formatted before being sent to the frontend for rendering.


<p align="right">(<a href="#contents">back to top</a>)</p>

---

[Back to Project Overview](../project-overview.md)
