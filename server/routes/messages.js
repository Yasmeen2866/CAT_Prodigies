const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../routes/messages'); // Import the Message model

// Middleware to handle POST requests to create a new message
router.post('/', (req, res) => {
    // Create a new message using the data from the request body
    const newMessage = new Message({
        sender: req.body.sender,
        recipient: req.body.recipient,
        text: req.body.text,
        file: req.body.file
    });

    // Save the message to the database
    newMessage.save()
        .then(savedMessage => {
            res.status(201).json(savedMessage);
        })
        .catch(err => {
            console.error('Error saving message:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Middleware to handle GET requests to retrieve all messages
router.get('/', (req, res) => {
    // Fetch all messages from the database
    Message.find()
        .then(messages => {
            res.status(200).json(messages);
        })
        .catch(err => {
            console.error('Error fetching messages:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

module.exports = router;
