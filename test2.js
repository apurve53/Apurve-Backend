const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app); // Create HTTP server from Express
const io = socketIO(server);           // Attach Socket.IO to the HTTP server

// Serve a basic HTML file (optional)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle Socket.IO connection
io.on('connection', (socket) => {
    console.log('✅ New client connected');

    socket.on('messageFromClient', (data) => {
        console.log('📩 Received from client:', data);

        // Respond back
        socket.emit('messageFromServer', 'Hello from server!');
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected');
    });
});

// Start server on port 3000
server.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});
