const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config(); // Use environment variables

// Create the server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); // Replace with your frontend URL
app.use(express.json());

// Temporary in-memory storage for chat messages
let messages = {}; // Object to store messages by roomId

// Socket.IO events
io.on("connection", (socket) => {
  console.log("A user connected");

  // Join a specific room
  socket.on("join room", (roomId) => {
    if (!roomId) {
      console.error("Room ID missing");
      socket.emit("error", "Room ID is required");
      return;
    }

    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    // Send chat history from memory
    const roomMessages = messages[roomId] || [];
    socket.emit("chat history", roomMessages);
  });

  // Handle incoming messages
  socket.on("private message", (msg) => {
    if (!msg.roomId || !msg.sender || !msg.text) {
      console.error("Invalid message format:", msg);
      socket.emit("error", "Invalid message format");
      return;
    }

    // Save message to in-memory storage
    if (!messages[msg.roomId]) {
      messages[msg.roomId] = [];
    }
    messages[msg.roomId].push(msg);

    // Broadcast message to the room
    io.to(msg.roomId).emit("chat message", msg);
  });

  // Leave the room
  socket.on("leave room", (roomId) => {
    if (!roomId) {
      console.error("Room ID missing on leave room");
      socket.emit("error", "Room ID is required");
      return;
    }

    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Optional: Add cleanup logic if needed
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});