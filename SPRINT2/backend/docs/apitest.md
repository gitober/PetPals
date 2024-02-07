# PetPals Social Media API Documentation (in progress)

## Authentication

### Register User

- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user.
- **Request:**
  - Body:
    - `username` (string, required): User's username
    - `email` (string, required): User's email
    - `password` (string, required): User's password
- **Response:**
  - Success: 201 Created
    ```json
    {
      "message": "User registered successfully"
    }
    ```
  - Error: 400 Bad Request
    ```json
    {
      "error": "Invalid request format"
    }
    ```

### Login User

- **Endpoint:** `POST /api/auth/login`
- **Description:** Log in an existing user.
- **Request:**
  - Body:
    - `email` (string, required): User's email
    - `password` (string, required): User's password
- **Response:**
  - Success: 200 OK
    ```json
    {
      "message": "Login successful",
      "token": "JWT_TOKEN"
    }
    ```
  - Error: 401 Unauthorized
    ```json
    {
      "error": "Invalid credentials"
    }
    ```

## Posts

### Get All Posts

- **Endpoint:** `GET /api/posts`
- **Description:** Get all posts.
- **Response:**
  - Success: 200 OK
    ```json
    [
      {
        "username": "petlover1",
        "caption": "My adorable pet in the sunshine!",
        "image": "https://example.com/pet1.jpg",
        "likes": 120,
        "comments": [
          { "username": "petfriend1", "text": "So cute!" },
          { "username": "petfriend2", "text": "Is that a smile? 😊" }
        ],
        "timestamp": "2022-02-01T10:15:00Z"
      },
      // More posts
    ]
    ```

### Create New Post

- **Endpoint:** `POST /api/posts`
- **Description:** Create a new post.
- **Request:**
  - Body:
    - `username` (string, required): User's username
    - `caption` (string, required): Post caption
    - `image` (string, required): URL of the post image
- **Response:**
  - Success: 201 Created
    ```json
    {
      "message": "Post created successfully"
    }
    ```
  - Error: 400 Bad Request
    ```json
    {
      "error": "Invalid request format"
    }
    ```

## Users

### Get User Profile

- **Endpoint:** `GET /api/users/:username`
- **Description:** Get user profile by username.
- **Response:**
  - Success: 200 OK
    ```json
    {
      "username": "petlover1",
      "email": "petlover1@example.com",
      "profile": {
        "name": "John Doe",
        "bio": "Pet lover and adventurer",
        "profileImage": "https://example.com/profile1.jpg"
      },
      "createdAt": "2022-01-01T08:00:00Z"
    }
    ```
  - Error: 404 Not Found
    ```json
    {
      "error": "User not found"
    }
    ```
