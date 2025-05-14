const express = require('express');
const cors = require('cors');
// const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const corsOptions = {
    origin: [],
    credentials: true,
}
const app = express();
app.use(cors(corsOptions));
// const options = {
//     key: fs.readFileSync('/etc/letsencrypt/live/worlddevelopment.in/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/worlddevelopment.in/fullchain.pem')
//     // key: fs.readFileSync('C:/Certbot/archive/worlddevelopment.in/privkey1.pem'),
//     // cert: fs.readFileSync('C:/Certbot/archive/worlddevelopment.in/fullchain1.pem')
// };
// const server = http.createServer(options, app);
const server = http.createServer(app);
const socketIO = require('socket.io');
const originList = [];
const io = socketIO(server, {
    allowRequest: (req, callback) => {
        const isAllowed = originList.includes(req.headers.referer) ||
            originList.includes(req.headers.referer?.slice(0, -1)) ||
            req.headers.referer === 'https://worlddevelopment.in/chatadminhome' ||
            req.headers['user-agent'] === 'node-XMLHttpRequest';
        console.log("isAllowed : ", isAllowed);
        callback(null, isAllowed);
    },
    cors: {
        origin: [],
        methods: ["GET", "POST"],
        credentials: true
    }
});
io.on('connection', (socket) => {
    // console.log(`Socket connection : ${query?.type} :: ${query?.user}:: ${socket.id}`);
    socket.on("urlProcess", async (obj) => {
        try {
            const { isDir, dirName, writePath, data } = obj;
            if (isDir) {
                console.log(`This is folder :, ${isDir}, ${dirName}`);
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