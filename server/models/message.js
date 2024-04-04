const mongoose = require('mongoose');

// Define the schema for the Message model
const messageSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },

  message: {
    type: String,
    required: true
  },

  user1: {
    type: String,
    required: true
  },

  user2: {
    type: String,
    required: true
  },

  status: {
    type: String,
    required: true
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
  
});

// Create the Message model based on the schema
const Message = mongoose.model('Message', messageSchema);

// Export the Message model
module.exports = Message;