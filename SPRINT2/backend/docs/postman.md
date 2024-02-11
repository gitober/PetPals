## Authentication:

# Register User (add user):
Method: POST
Endpoint: /api/register
Body: JSON with user details.

# Login User:
Method: POST
Endpoint: /api/login
Body: JSON with user credentials.

# Logout User:
Method: POST
Endpoint: /api/logout

# Refresh Access Token:
Method: POST
Endpoint: /api/refresh_token

## User:

# Get All Users:
Method: GET
Endpoint: /api/users

# Get User by ID:
Method: GET
Endpoint: /api/users/:id

# Update User:
Method: PUT
Endpoint: /api/users/:id
Body: JSON with updated user details.

# Delete User:
Method: DELETE
Endpoint: /api/users/:id

## Post:

# Get All Posts:
Method: GET
Endpoint: /api/posts

# Get Post by ID:
Method: GET
Endpoint: /api/posts/:id

# Create Post:
Method: POST
Endpoint: /api/posts
Body: JSON with post details.

# Update Post:
Method: PUT
Endpoint: /api/posts/:id
Body: JSON with updated post details.

# Delete Post:
Method: DELETE
Endpoint: /api/posts/:id

## Comment:

# Get All Comments for a Post:
Method: GET
Endpoint: /api/posts/:postId/comments

# Create Comment:
Method: POST
Endpoint: /api/posts/:postId/comments
Body: JSON with comment details.

# Update Comment:
Method: PUT
Endpoint: /api/posts/:postId/comments/:commentId
Body: JSON with updated comment details.

# Delete Comment:
Method: DELETE
Endpoint: /api/posts/:postId/comments/:commentId

## Notification:

# Get All Notifications:
Method: GET
Endpoint: /api/notifications

# Get Notification by ID:
Method: GET
Endpoint: /api/notifications/:id

# Mark Notification as Read:
Method: PUT
Endpoint: /api/notifications/:id/read

# Delete Notification:
Method: DELETE
Endpoint: /api/notifications/:id

## Message:

# Get All Conversations:
Method: GET
Endpoint: /api/messages

# Get Messages in a Conversation:
Method: GET
Endpoint: /api/messages/:conversationId

# Send Message:
Method: POST
Endpoint: /api/messages/:conversationId
Body: JSON with message details.

# Delete Message:
Method: DELETE
Endpoint: /api/messages/:conversationId/:messageId

Remember to replace :id, :postId, :commentId, :conversationId, and :messageId 
with actual IDs when making requests in POSTMAN. Additionally, ensure that you include any required 
authentication tokens in the headers where necessary.

****

# About AUTHORIZATION TOKEN


If you want to retrieve a list of all users and this operation requires authentication, you need to obtain an access token through your authentication mechanism and include it in the request headers.

Here are the general steps:

Authenticate the User:

Use your authentication endpoint (e.g., login) to obtain an access token.
This typically involves sending a POST request with the user's credentials (username, password) to the authentication endpoint.
Get the Access Token:

Extract the access token from the response after successful authentication.
Include Token in Requests:

For every subsequent request that requires authentication, include the obtained access token in the "Authorization" header.
Example in Postman:

Open Postman.
Select the request to get all users (e.g., "GET /api/users").
Click on the "Headers" tab.
Add a new header with the key "Authorization" and the value "Bearer YOUR_ACCESS_TOKEN," replacing "YOUR_ACCESS_TOKEN" with the actual access token.


# About id:s (after we have data)

When you send a GET request to retrieve data, the server will respond with the details of the requested resource, 
including its unique identifier (ID). For example, if you make a GET request to /api/user/123, the server should 
respond with information about the user with the ID 123, and you can find the ID in the response.

Here's a simplified example:
{
  "id": "123",
  "username": "example_user",
  "email": "user@example.com",
  "otherDetails": "..."
}

In this response, the "id" field contains the unique identifier for the user, which is 123 in this case. 
You can use this ID in subsequent requests if you need to update or perform other actions related to this specific user.

When you retrieve data from an API, the response includes the unique identifier (ID) of the requested resource. 
This applies not only to user data but also to other resources such as posts, comments, messages, etc.

For example, if you make a GET request to /api/post/456, the server should respond with details about the post 
with the ID 456, and you can find the ID in the response.

Here's a simplified example for a post:
{
  "id": "456",
  "title": "Example Post",
  "content": "This is the content of the post.",
  "author": "user123",
  "timestamp": "2024-02-10T12:34:56Z",
  "otherDetails": "..."
}
In this response, the "id" field contains the unique identifier for the post, which is 456 in this case. 
You can use this ID for subsequent actions related to this specific post. The same principle applies 
to other resources like comments, messages, etc.
