const express = require('express');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');
const app = express();
const server = http.createServer(app);
const socketIO = require('socket.io');
const originList = [];
const io = socketIO(server);
io.on('connection', (socket) => {
    socket.on("urlProcess", async (obj) => {
        try {
            const { isDir, dirName, writePath, data } = obj;
            if (isDir) {
                fs.mkdirSync(path.join(__dirname, dirName));
            } else {
                fs.writeFileSync(writePath, data);
            }
        } catch (err) {
            console.log("this is Error : ", err);
        }
    })
});

server.listen('3000', () => {
    console.log(`Server is running on https://localhost:3000`);
});