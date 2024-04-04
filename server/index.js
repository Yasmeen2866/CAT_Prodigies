const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const socketio = require('socket.io');
const Message = require('./models/message'); // Import your Message model
const messagesRouter = require('./routes/messages');

// Create Express app
const app = express();

// Create HTTP server
const server = require('http').Server(app);

// Set up Socket.io
const io = socketio(server, { 
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
  }
});

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

// Define port
const port = process.env.PORT || 5021;

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB database
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware to allow CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use routes
app.use('/messages', messagesRouter);

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  // Handle "sendMessage" event
  socket.on('sendMessage', async (messageData) => {
    console.log(`Socket is connected ${JSON.stringify(messageData)}`);
    
    // Ensure that user1 and user2 are provided in messageData
    if (!messageData.user1) {
      console.error('user1 is required');
      return;
    }
    if (!messageData.user2) {
      console.error('user2 is required');
      return;
    }

    // Create new message object
    const message = new Message({
      user1: messageData.user1,
      user2: messageData.user2,
      message: messageData.message,
      status: messageData.status || 'default_status', // Assuming 'status' is an optional field with default value
    });

    try {
      // Save message to the database
      await message.save();
      // Emit message to all connected clients
      io.emit('message', message);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});
