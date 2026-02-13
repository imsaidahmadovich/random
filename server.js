const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname)); // Serves your HTML/CSS

let chatHistory = []; // Stored in RAM (Temporary)

io.on('connection', (socket) => {
    // Send existing history to the new user so they aren't lost
    socket.emit('load history', chatHistory);

    socket.on('new message', (data) => {
        chatHistory.push(data);
        // Broadcast to EVERYONE (syncing all tabs)
        io.emit('broadcast message', data);
    });

    socket.on('clear session', () => {
        chatHistory = [];
        io.emit('session cleared');
    });
});

http.listen(3000, () => {
    console.log('GhostChat running on http://localhost:3000');
});