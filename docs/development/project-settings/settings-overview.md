# Settings Overview

## Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration Files](#configuration-files)
  - [Backend .env File](#backend-env-file)
  - [Frontend .env File](#frontend-env-file)
  - [Additional Configuration](#additional-configuration)
- [Database Overview](#database-overview)
- [Email Service](#email-service)
- [Security Configuration](#security-configuration)

---

## Getting Started

### Prerequisites
To run the PetPals project locally, ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **npm**
- **MongoDB Atlas** (cloud-based database service)
- A code editor, such as **VS Code**
- A **Gmail account** configured with an **App Password** for email service.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/gitober/PetPals.git
   ```
2. Navigate to the project directory:
   ```bash
   cd PetPalsApp
   ```
3. Install dependencies for directory `PetPalsApp`, `PetPalsApp/backend` and `PetPalsApp/frontend`:
   ```bash
   npm install
   ```
4. Configure environment variables for both the backend and frontend (see [Configuration Files](#configuration-files)).
5. Start the application:
   - To run the backend and frontend **separately**:
     - Navigate to directory `PetPalsApp/backend` and run:
       ```bash
       npm run dev
       ```
     - Navigate to directory `PetPalsApp/frontend` and run:
       ```bash
       npm start
       ```
   - To run both the backend and frontend **simultaneously**, navigate to root directory `PetPalsApp` and execute:
     ```bash
     npm start
     ```

<p align="right">(<a href="#contents">back to top</a>)</p>

---

## Configuration Files

### Backend .env File
The backend `.env` file contains sensitive information like database credentials, email configuration, and JWT secrets. Create a `.env` file in the `backend` folder with the following content:

```plaintext
# Application environment and port
NODE_ENV=development
PORT=4000

# MongoDB connection strings
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/petpals?retryWrites=true&w=majority
TEST_MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/petpals-test?retryWrites=true&w=majority

# Secret keys for authentication
SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_jwt_secret

# Email configuration
EMAIL=your_email_address
EMAIL_PASSWORD=your_email_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Explanation**:
- `NODE_ENV`: Defines the environment (e.g., development, production).
- `PORT`: Specifies the port for the backend server (commonly 4000 or 5000).
- `MONGO_URI`: Connection string for your MongoDB database hosted on **MongoDB Atlas**.
- `TEST_MONGO_URI`: Connection string for the test database. Avoid omitting this to ensure tests do not overwrite production data.
- `SECRET` and `REFRESH_SECRET`: Keys for signing JWT tokens. Generate strong, unique keys yourself using a random string generator.
- `EMAIL` and `EMAIL_PASSWORD`: Email credentials for sending automated emails. Use a **Gmail account** and set up an **App Password** via your Google account security settings.
- `FRONTEND_URL`: URL of the frontend application (commonly http://localhost:3000).

---

### Frontend .env File
The frontend `.env` file is located in the `frontend` folder. Add the following:

```plaintext
# API URL for backend
REACT_APP_API_URL=http://localhost:4000/api
```

**Note**: Update `REACT_APP_API_URL` with the deployed backend URL when in production.

<p align="right">(<a href="#contents">back to top</a>)</p>

---

## Database Overview

The application uses **MongoDB Atlas** for storing data. Follow these steps to set up:

1. **Create a MongoDB Atlas Account**:
   - Visit [MongoDB Atlas](https://www.mongodb.com/atlas) and register for a free account.
2. **Create a Project and Cluster**:
   - Set up a new project for PetPals.
   - Create two clusters: one for production data and one for test data.
3. **Configure Access**:
   - Whitelist your IP address.
   - Create a database user with a secure password.
4. **Connect**:
   - Obtain the connection string for your cluster and update the `MONGO_URI` in the backend `.env` file.
   - Add the test connection string to `TEST_MONGO_URI` to avoid overwriting production data during tests.

**MongoDB Collections**:

The collections go automatically to the MongoDB database after first signup in the app:

- **Users**: Stores user information such as username, email, and password.
- **Posts**: Stores posts created by users, including images, likes, and comments.
- **Comments**: Stores comments made on posts.

<p align="right">(<a href="#contents">back to top</a>)</p>

---

## Email Service
The PetPals application uses a Gmail-based email service to send automated emails. Follow these steps to configure it:

1. **Set Up a Gmail Account**:
   - Create a Gmail account if you don’t have one.
   - Enable **2-Step Verification** in your Google account settings.

2. **Generate an App Password**:
   - Navigate to the **Security** section in your Google account settings.
   - Under **Signing in to Google**, select **App Passwords**.
   - Choose the app and device, then generate a password.

3. **Configure Environment Variables**:
   - Add the generated app password as `EMAIL_PASSWORD` and your Gmail address as `EMAIL` in the backend `.env` file.

4. **Verify Configuration**:
   - Test the email service by sending a test email using the application.

<p align="right">(<a href="#contents">back to top</a>)</p>

---

## Security Configuration

The project uses **JWT-based authentication** for secure access to protected routes.

### Key Points:
1. **JWT Secrets**:
   - `SECRET` is used for short-lived access tokens.
   - `REFRESH_SECRET` is used for longer-lived refresh tokens.

2. **CORS Configuration**:
   - The backend restricts access to requests coming from the frontend URL specified in the `FRONTEND_URL` environment variable.

3. **Password Hashing**:
   - User passwords are hashed using **bcrypt** for enhanced security.

4. **Environment Variables**:
   - Always store sensitive information like database credentials and secrets in environment variables and never commit them to the repository.

<p align="right">(<a href="#contents">back to top</a>)</p>

---

[Back to Project Overview](../../project-overview.md)

