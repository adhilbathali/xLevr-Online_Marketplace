const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

// Create the server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/chatSystem', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Chat schema and model
const ChatSchema = new mongoose.Schema({
  roomId: String,
  sender: String,
  message: String,
  timestamp: Date,
});
const Chat = mongoose.model('Chat', ChatSchema);

// Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected');

  // Join a specific room
  socket.on('join room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
    
    // Fetch chat history for the room
    Chat.find({ roomId }).sort({ timestamp: 1 }).then((history) => {
      socket.emit('chat history', history); // Send chat history to the user
    });
  });

  // Handle incoming messages
  socket.on('private message', async (msg) => {
    const newMessage = new Chat({
      roomId: msg.roomId,
      sender: msg.sender,
      message: msg.text,
      timestamp: new Date(),
    });

    await newMessage.save(); // Save message to database

    io.to(msg.roomId).emit('chat message', newMessage); // Send message to all users in the room
  });

  // Leave the room
  socket.on('leave room', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// API endpoint to fetch room-specific chat history
app.get('/api/chat/:roomId', async (req, res) => {
  const roomId = req.params.roomId;
  const chatHistory = await Chat.find({ roomId }).sort({ timestamp: 1 });
  res.json(chatHistory);
});
