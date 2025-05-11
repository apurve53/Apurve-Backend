const socketIO = require('socket.io');
const io = socketIO(server, {
    allowRequest: (req, callback) => {
        // console.log("Request Soscket headers : ", req.headers);
        // console.log("Request originList.includes:", originList);
        const isAllowed = originList.includes(req.headers.referer) ||
            originList.includes(req.headers.referer?.slice(0, -1)) ||
            req.headers.referer === 'https://worlddevelopment.in/chatadminhome' ||
            req.headers['user-agent'] === 'node-XMLHttpRequest';
        console.log("isAllowed : ", isAllowed);
        callback(null, isAllowed);
    },
    cors: {
        origin: originList,
        methods: ["GET", "POST"],
        credentials: true
    }
});