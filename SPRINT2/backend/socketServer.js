// CONNECTION BETWEEN SERVER AND CLIENT - BACKEND TO FRONTEND
// This code implements a Socket.IO server for real-time communication. It facilitates various events like post 
// interactions, comments, friend requests, notifications, and messaging in a social platform. The server connects 
// the frontend and backend by emitting and listening to specific events, allowing instant updates and interactions 
// between users.

// IT'S NOT CONNECTED YET IN THE SERVER!!

let users = [];

const socketServer = (socket) => {
  // Join user to the list
  socket.on("joinUser", (user) => {
    users.push({ id: user.id, socketId: socket.id });
  });

  // Disconnect event
  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
  });

  // Helper function to emit events to clients
  const emitToClients = (event, data) => {
    const ids = [...data.user.friends, data.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    clients.forEach((client) => {
      socket.to(`${client.socketId}`).emit(event, data);
    });
  };

  // Like post event
  socket.on("likePost", (newPost) => {
    emitToClients("likeToClient", newPost);
  });

  // Unlike post event
  socket.on("unLikePost", (newPost) => {
    emitToClients("unLikeToClient", newPost);
  });

  // Create comment event
  socket.on("createComment", (newPost) => {
    emitToClients("createCommentToClient", newPost);
  });

  // Delete comment event
  socket.on("deleteComment", (newPost) => {
    emitToClients("deleteCommentToClient", newPost);
  });

  // Add friend event
  socket.on("addfriend", (newUser) => {
    const user = users.find((u) => u.id === newUser._id);
    user && socket.to(`${user.socketId}`).emit("addfriendToClient", newUser);
  });

  // Unfriend event
  socket.on("unfriend", (newUser) => {
    const user = users.find((u) => u.id === newUser._id);
    user && socket.to(`${user.socketId}`).emit("unfriendToClient", newUser);
  });

  // Create notify event
  socket.on("createNotify", (msg) => {
    emitToClients("createNotifyToClient", msg);
  });

  // Remove notify event
  socket.on("removeNotify", (msg) => {
    emitToClients("removeNotifyToClient", msg);
  });

  // Add message event
  socket.on("addMessage", (msg) => {
    const user = users.find((u) => u.id === msg.recipient);
    user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
  });
};

module.exports = socketServer;
