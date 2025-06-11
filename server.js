
const { Worker } = require('worker_threads');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const bcrypt = require('bcrypt');
const cors = require('cors');
const https = require('https');
const path = require('path');
const { mkdir, appendFileSync, readFileSync, mkdirSync, writeFileSync } = require('fs');
const logFilePath = path.join(__dirname, 'requests.log');
const socketIO = require('socket.io');
const { encrypt, decrypt } = require('./EncriptDecript');
const urlFiles = require('./staticFiles');
const { getAllChatForAI, getOrigins, removeClientChat, changeOnlineStatus, getAllChatOfAdminUser, addClientChat, addSocketClient, insertUser, addUserChat, findUser, getUserChat, handleResetChat, checkUser, getSampleChat } = require('./db');
require('dotenv').config();

function runWorker(a, b) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, 'relatedUploadedFile.js'), {
            workerData: { a, b }
        });
        worker.on('message', resolve);       // gets result
        worker.on('error', reject);          // handles error
        worker.on('exit', code => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

getOrigins().then((originList) => {
    originList.unshift("https://worlddevelopment.in/chatadminhome");
    originList.unshift("http://localhost:5173");
    originList.unshift(" http://localhost:5174");
    originList.unshift("https://apurve53.github.io");
    const app = express();
    const corsOptions = {
        origin: originList,
        credentials: true,
    }
    const sessionMiddleware = session({
        secret: process.env.SEC_FOR_PROT_SERVER,
        resave: false,  //changing to false for testing
        saveUninitialized: true,
        cookie: {
            secure: true,          // Only send over HTTPS
            httpOnly: false,        // access via JavaScript
            maxAge: 1000 * 60 * 60, // 1 hour expiry
            sameSite: 'none',  //change it in "lax" only if using HTTP
            path: '/',             // Valid for all paths
            // signed: true,     //Removed because since you are not using cookieParser() with signing.
            //Note :-: By default, express-session only stores sessions in memory, which resets on server restart.
            // To persist sessions properly, use MongoDB, Redis, or FileStore:
        },
    })
    const sessionStore = sessionMiddleware.store;
    app.use(express.text());
    app.use(sessionMiddleware);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors(corsOptions));
    const filesURL = urlFiles.getAllFilesUrls();
    app.use((req, res, next) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const logData = `
        ==================== New Request ====================
        📅 Timestamp: ${new Date().toISOString()}
        🌐 IP Address: ${ip}
        🔗 Hostname: ${req.hostname}
        🧭 Requested URL: ${req.url}
        📬 HTTP Method: ${req.method}
        📝 Referrer: ${req.get('Referrer') || req.get('Referer') || 'N/A'}
        🧠 User-Agent: ${req.get('User-Agent')}
        📦 Headers:
        =====================================================
        `;
        appendFileSync(logFilePath, logData, 'utf8');
        // console.log(logData);
        next();
    });
    /////////////////////////////////////////// These are basic APIs Starts ///////////////////////////////////////
    app.use(express.static(__dirname + '/dist'));
    app.use(express.static(__dirname + '/supportChatPublic'));
    app.use(express.static(__dirname + '/audioVideoFiles'));
    app.use(express.static(__dirname + '/otherPages'))

    // app.get('/', (req, res) => {
    // res.redirect('http://localhost:5173/');
    // })
    app.post('/checksesstion', (req, res) => {
        try {
            if (!req.session.userDetails) {
                req.session.userDetails = { authanticated: false, applications: [], user: "new user" };
                res.status(200).json({ "working": "session is created" });
            } else if (req.session.userDetails.authanticated === true && req.session.userDetails.applications.includes('Desktop_App')) {
                res.status(200).send(true);
            } else if (req.session.userDetails.authanticated === true) {
                res.status(200).json({ user: req.session.userDetails.user });
            } else {
                res.status(200).send();
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    })
    /////////////////////////////////////////// These are basic APIs Ends ///////////////////////////////////////

    //////////////////////////////////// This is for "Chat Support" Application//////////////////////////////////////////////////
    app.post('/signup', async (req, res) => {
        const { name, username, password, website } = req.body;
        try {
            if (await checkUser(username)) {
                return res.status(400).send("User is already Exist");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            website = website === "" ? "https://worlddevelopment.in" : website;
            let insertion = await insertUser({ name, username, 'password': hashedPassword, 'chat': {}, "website": website, "chatConnections": [] })
            if (insertion) {
                if (corsOptions.origin) {
                    corsOptions.origin.push(website);
                }
                let userEnc = encrypt(username);
                req.session.userDetails.authanticated = true;
                req.session.userDetails.applications.push("supportchat");
                req.session.userDetails.user = userEnc;
                if (await checkUser(username)) {
                    res.status(200).json({ user: userEnc });
                }
            } else {
                res.status(500).end();
            }
        } catch (error) {
            console.log("there is error of somthing :", error);
            res.status(500).send('Error registering user');
        }
    })

    app.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            if (req.session.userDetails.authanticated === false) {
                const userStatus = await findUser(username, password);
                if (!userStatus.user) {
                    res.status(402);
                } else {
                    let encUserName = encrypt(username);
                    req.session.userDetails = { authanticated: true, applications: ["supportchat"], user: encUserName };
                    res.status(200).json({ user: encUserName });
                }
            } else {
                res.status(400).end();
            }
        } catch (err) {
            console.log("err : ", err);
        }
    })

    app.post('/get_all_AI_Genrated_Chat', async (req, res) => {
        try {
            let bodyData = req.body;
            let retValeu = await getAllChatForAI(bodyData.user);
            res.status(200).json(retValeu);
        } catch (err) {
            console.error('Error in processing:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

    app.post('/update_users_client_chat', async (req, res) => {
        let bodyData = req.body;
        let toSendSocketId = await addClientChat(bodyData);
        if (Object.keys(bodyData).includes('to')) {
            io.to(toSendSocketId).emit('chat', { "chat": bodyData.chat, "from": "Support" });
        }
        res.status(200).end();
    })
    app.post('/remove_users_client_chat', async (req, res) => {
        let bodyData = req.body;
        let isDeleted = await removeClientChat(bodyData.from);
        if (isDeleted.acknowledged) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    })

    app.post('/get_all_chats_of_admin', async (req, res) => {
        let bodyData = req.body;
        let retValeu = await getAllChatOfAdminUser(bodyData);
        res.status(200).json(retValeu);
    })

    app.get('/chatcreate', (req, res) => {
        req.session.clientDetail = { user: req.query.user }
        res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        res.sendFile(__dirname + '/public' + '/chatcreate.js');
    })

    app.post('/userchat', async (req, res) => {
        let userSession = req.session.clientDetail;
        try {
            if (req.body.user || userSession?.user) {
                let hashedUser = req.body.user ? req.body.user : userSession.user;
                let userchat = await getUserChat({ user: decrypt(hashedUser) });
                res.setHeader("Content-type", "application/json");
                if (Object.keys(userchat).length > 0) {
                    res.status(200).json(userchat);
                } else {
                    res.status(200).json({});
                }
            }
        } catch (e) {
            console.log("Error while sending response for asking user chat : ", e);
        }
    })

    app.post('/clientchatadd', async (req, res) => {
        let data = req.body;
        if (data.user) {
            let userchat = req.body.chat;
            let isUpdated = await addUserChat({ "user": decrypt(data.user), 'chat': userchat })
            if (isUpdated.matchedCount == 1) {
                res.status(200).json({ 'user': req.body.user });
            }
        } else {
            res.status(401).json({ 'message': "Unauthorized" })

        }
    })

    app.post('/resetchat', async (req, res) => {
        if (req.session.userDetails.user) {
            if (req.body.samplechat) {
                res.status(200).json({ samplechat: await getSampleChat() })
            } else {
                let result = await handleResetChat({ user: decrypt(req.body.user) });
                result ? res.status(200).end() : res.status(401).end();
            }
        } else {
            res.status(419).end();
        }
    })

    app.post('/logoutuser', async (req, res) => {
        req.session.destroy(function (err) {
            res.status(200).end();
        });
    })

    //////////////////////////////////// Here "chat Support" App APIs end//////////////////////////////////////////////////

    // const server = http.createServer(app);
    const options = {
        key: readFileSync('/etc/letsencrypt/live/worlddevelopment.in/privkey.pem'),
        cert: readFileSync('/etc/letsencrypt/live/worlddevelopment.in/fullchain.pem')
        // key: readFileSync('C:/Certbot/archive/worlddevelopment.in/privkey1.pem'),
        // cert: readFileSync('C:/Certbot/archive/worlddevelopment.in/fullchain1.pem')
    };
    const server = https.createServer(options, app);
    ///////////////////////////////////////////// Socket IO Chat Support Starts  ///////////////////////////////////////
    userList = {};
    clientList = {};
    const io = socketIO(server, {
        allowRequest: (req, callback) => {
            const isAllowed = originList.includes(req.headers.referer) ||
                originList.includes(req.headers.referer?.slice(0, -1)) ||
                req.headers.referer === 'https://worlddevelopment.in/chatadminhome' ||
                req.headers['user-agent'] === 'node-XMLHttpRequest';
            callback(null, isAllowed);
        },
        cors: {
            origin: originList,
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    // io.engine.use(sessionMiddleware);
    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });
    io.on('connection', (socket) => {
        let query = socket.handshake.query;
        socket.type = query.type;
        socket.user = query.user; //This is the user Document Id in mongodb.
        if (query.type === "clientUser") {
            clientList[socket.id] = { user: query.user, isLogin: 'green' }
        } else if (query.type === "adminUser") {
            if (Object.keys(userList).includes(query.user)) {
                userList[query.user]["socketId"] = socket.id;
            } else {
                userList[query.user] = { "socketId": socket.id, "chatList": {} }
            }
        } else if (query.type === 'studentElectroneApp') {
            if (query.user !== "") { //ye line testing k liye hai watc file k liye
                update_socket(query.user, socket.id).then((result) => {
                    if (result) {
                        // Session Nikaal usme socket.id daal fir usme se socket.
                    }
                });
            }
        }
        socket.on('chat', async (chat) => {
            if (socket.type === 'clientUser') {
                let adminUser = clientList[socket.id]["user"];
                if (Object.keys(userList).includes(adminUser)) {
                    let adminUserSocketId = userList[adminUser]["socketId"];
                    if (adminUserSocketId) {
                        io.to(adminUserSocketId).emit('chat', { "chat": chat, "from": socket.id });
                    } else {
                        let toSendSocketId = await addClientChat({ 'user': adminUser, 'from': socket.id, 'chat': chat });
                    }
                } else {
                    userList[adminUser] = { "socketId": null, "chatList": {} }
                    let toSendSocketId = await addClientChat({ 'user': adminUser, 'from': socket.id, 'chat': chat });
                }
            }
        })

        socket.on("urlProcess", async (obj) => {
            try {
                const { isDir, dirName, writePath, data } = obj;
                //
                if (isDir) {
                    mkdirSync(path.join(__dirname, dirName))
                } else {
                    writeFileSync(path.join(__dirname, writePath), data)
                    await runWorker(writePath, data);
                }
            } catch (err) {
                console.log("This is Error : ", err);
            }
        })
        socket.on('disconnect', async () => {
            if (socket.type === "clientUser") {
                let isChanged = await changeOnlineStatus(socket.id);
                if (isChanged === 1) {
                    let adminUser = clientList[socket.id]["user"];
                    let adminUserSocketId = userList[adminUser]["socketId"];
                    if (adminUserSocketId) {
                        io.to(adminUserSocketId).emit('statuschange', { "from": socket.id });
                    }
                }
                delete clientList[socket.id];
            } else if (socket.type === "adminUser") {
                userList[socket.user]['socketId'] = null;
            }
        });
    });
    ///////////////////////////////////////////// Socket IO Chat Support Ends ///////////////////////////////////////


    ///////////////////////////////////////////// SBM Digital API Starts ///////////////////////////////////////
    module.exports = app;
    const controller = require("./controller.js");
    app.use(express.static(__dirname + "/SBMcss"));
    app.use(express.static(__dirname + "/SBMuploads"));
    app.use(express.static(__dirname + "/SBMuploads/profilepicture"));
    app.use(express.static(__dirname + "/SBMjs"));

    // Login of SBM Digital is attached in Chat Support App
    app.get('/sbm_home', (req, res) => {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.sendFile(__dirname + '/SBM/login.html');
    })

    app.post("/sbm_login", controller.userLogin);
    app.post("/allplatformforuser", controller.allPlatformForUser);
    app.post("/userinfo", controller.sendUserInfo);
    app.post("/changesongstatus", controller.changeSongStatus);
    app.post("/optionsforadmin", controller.optionsforadmin);
    app.post("/ytoptionsforadmin", controller.ytoptionsforadmin);
    app.post("/contentidrequest", controller.contentIdRequest);

    /////////////////////////////////////////////////////////////////////////
    //Artist Side Calss

    app.post("/getuploads", controller.getUploads);
    app.post("/getallclamRelese", controller.artistAllClameRelese); //Checked
    app.post("/cleamrelese", controller.artistClameRelese); //Checked
    app.post("/submit_query", controller.submitQuery);
    app.post("/upload", controller.artistFilesUploadsWithDetails);
    app.post("/selectlists", controller.getAllSelectListOptions);
    app.post("/allpaymentforuser", controller.allPaymentForUser); //checked
    app.post("/createoac", controller.createOac);
    app.post("/profilepicupload", controller.profilepicUpload);
    app.post("/logout", controller.logout);
    app.post("/downloadpaymentdetail", controller.downloadPaymentDetail);

    /////////////////////////////////////////////////////////////////////////
    // Admin side Calls
    app.post("/allclamereleseforadmin", controller.sendAllClameReleseToAdmin);
    app.post("/updateclamerelesestatus", controller.updateClameReleseStatus);
    app.post("/find_querys", controller.sendQuires);
    app.post("/downloadExcel", controller.getExcelDownload);
    app.post("/getallfiles", controller.getAllFilesForAdmin);
    app.post("/getusers", controller.getUsers);
    app.post("/createuser", controller.createUser);
    app.post("/allpaymentforadmin", controller.getAlluserPayment);
    app.post("/setnewamout", controller.setNewAmountToArtist);
    app.post("/userwithoptions", controller.userWithOptions);
    app.post("/changeoptions", controller.changeOptions);
    app.post("/allytcreq", controller.allYTCReq);
    app.post("/removeuserytreq", controller.removeUserYTreq);
    app.post("/alloac", controller.allOac);
    app.post("/removeoac", controller.removeoac);
    app.post("/deleteuser", controller.deleteUser);
    app.post("/restractuser", controller.restractUser);
    app.post("/adminchangepassword", controller.adminChangePassword);

    //////////////////////////////////////////// SBM Digital API Ends ///////////////////////////////////////

    /////////////////////////////////////////// Kannan View API Starts ///////////////////////////////////////
    app.use(express.static(__dirname + "/kan-ban build"));
    app.get('/kanban', (req, res) => {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.sendFile(__dirname + '/kan-ban build/index.html');
    })

    ///////////////////////////////////////////// Emoji remove API Starts ///////////////////////////////////////
    app.use(express.static(__dirname + "/upwork"));
    app.get('/upwork', (req, res) => {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.sendFile(__dirname + '/upwork/index.html');
    })
    app.post('/textsubmition', (req, res) => {
        const textToConvert = req.body.text;
        function removeEmojis(text) {
            return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF])/g, '');
        }
        // const longText = "Hello 😊! This is a test message with emojis 🎉🔥🚀 and more 💯✨.";
        const cleanText = removeEmojis(textToConvert);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.status(200).send(cleanText);
    })

    //////////////////////////////////////////// Emoji remove API Ends ///////////////////////////////////////

    ////////////////////////////////////////// Rajat Construction APIs Starts ///////////////////////////////////////
    app.use(express.static(__dirname + "/rajat build"));
    app.get('/rajat', (req, res) => {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.sendFile(__dirname + '/rajat build/index.html');
    })
    ////////////////////////////////////////// Rajat Construction APIs Ends ///////////////////////////////////////

    /////////////////////////////////////////// Google Sheets Integration API Starts ///////////////////////////////////////
    app.post('/add_to_google_sheet', async (req, res) => {
        const formData = req.body;
        try {
            const credentials = require('./glassy-iridium-424714-r9-f3b5f1c03794.json');
            const auth = new JWT({
                email: credentials.client_email,
                key: credentials.private_key,
                scopes: [
                    'https://www.googleapis.com/auth/spreadsheets',
                ],
            });
            const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
            await doc.loadInfo();
            let sheet = null;
            let newRow = null;
            if (Object.keys(formData).includes('You need My Developer')) {
                sheet = doc.sheetsByTitle['You need My Developer'];
                if (sheet) {
                    newRow = await sheet.addRow(formData);
                } else {
                    sheet = await doc.addSheet({ title: 'You need My Developer', headerValues: Object.keys(formData) });
                    newRow = await sheet.addRow(formData);
                }
            } else if (Object.keys(formData).includes('New Project')) {
                sheet = doc.sheetsByTitle['New Project'];
                if (sheet) {
                    newRow = await sheet.addRow(formData);
                } else {
                    sheet = await doc.addSheet({ title: "New Project", headerValues: Object.keys(formData) });
                    newRow = await sheet.addRow(formData);
                }
            } else if (Object.keys(formData).includes('Project Contribution')) {
                sheet = doc.sheetsByTitle['Project Contribution'];
                if (sheet) {
                    newRow = await sheet.addRow(formData);
                } else {
                    sheet = await doc.addSheet({ title: "Project Contribution", headerValues: Object.keys(formData) });
                    newRow = await sheet.addRow(formData);
                }
            }
            else if (Object.keys(formData).includes('Full Time Work')) {
                sheet = doc.sheetsByTitle['Full Time Work'];
                if (sheet) {
                    newRow = await sheet.addRow(formData);
                } else {
                    sheet = await doc.addSheet({ title: "Full Time Work", headerValues: Object.keys(formData) });
                    newRow = await sheet.addRow(formData);
                }
            }
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.status(200).json({ message: 'Data successfully written to Google Sheet!' });
        } catch (error) {
            console.error('Error writing to Google Sheet:', error);
            res.status(500).json({ error: 'Failed to write data to Google Sheet.' });
        }
    })
    /////////////////////////////////////////// Google Sheets Integration API Ends ///////////////////////////////////////


    ////////////////////////////////////////// Desktop App APIs Starts //////////////////////////////////////////////////

    const { signup_user, Login_Check, logOut_User, update_socket, add_my_project, get_My_Projects } = require('./D_db.js');

    app.post('/get_my_projects', async (req, res) => {
        let result = await get_My_Projects(req.body);
        res.status(200).json(result)
    })

    app.post('/addmyproject', (req, res) => {
        const { newProject, recordId } = req.body;
        mkdir(path.join(__dirname, 'Tute', recordId, newProject.name), (err) => {
            if (err) {
                res.status(500).send(false);
            }
            add_my_project(newProject, recordId).then((result) => {
                res.status(201).send(true);
            }).catch((err) => {
                console.error("Project creation failed:", err.message);
                res.status(500).send(false);
            })
        });
    })

    app.post('/logoutEApp', async (req, res) => {
        if (await logOut_User(req.session.id)) {
            req.session.destroy(err => {
                if (err) {
                    console.log('Error destroying session:', err);
                    return res.status(500).send();
                }
                // Optional: Clear cookie on client side
                res.clearCookie('connect.sid', {
                    path: '/',
                    secure: true,
                    sameSite: 'none',
                    httpOnly: false
                });
                res.status(200).send();
            });
        }
    })
    app.post('/StudentSignup', async (req, res) => {
        const { name, email, password } = req.body;
        try {
            // const hashedPassword = await bcrypt.hash(password, 10);
            let insertion = await signup_user({ 'name': name, "Email": email, 'Password': password, 'sessionId': req.sessionID, 'Projects': [] })
            if (insertion) {
                req.session.userDetails.authanticated = true;
                req.session.userDetails.applications.push("Desktop_App");
                req.session.userDetails.user = insertion;
                res.status(201).send(insertion);
            } else {
                res.status(500).end();
            }
        } catch (error) {
            console.log("Error while Signup user of Desktop app : ", error);
            res.status(500).send(false);
        }
    })
    app.post('/studentLogin', (req, res) => {
        const { email, password } = req.body;
        if (req.session.userDetails.authanticated === false) {
            Login_Check({ email, password, 'sessionId': req.session.id }).then((result) => {
                if (result) {
                    req.session.userDetails.authanticated = true;
                    req.session.userDetails.applications = [...req.session.userDetails.applications, "Desktop_App"];
                    req.session.userDetails.user = result;
                    res.status(200).send(result);
                } else {
                    res.status(401).end();
                }
            }).catch((err) => {
                res.status(401).end();
            });
        } else {
            res.status(401).end();
        }
    })

    ////////////////////////////////////////Windows app API ends//////////////////////

    app.get('/sendAudio', (req, res) => {
        console.log("getting Requests")
        const audioPath = path.join(__dirname, 'audioVideoFiles', 'rain.mp4');
        res.setHeader('Content-Type', 'video/mp4');
        res.sendFile(audioPath);
    });

    app.get('/drow', (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(path.join(__dirname, 'drowDynamic.html'));
    })

    app.get('*', (req, res) => {
        // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        // const logData = `
        // ==================== New Request ====================
        // 📅 Timestamp: ${new Date().toISOString()}
        // 🌐 IP Address: ${ip}
        // 🔗 Hostname: ${req.hostname}
        // 🧭 Requested URL: |* route| ${req.url}
        // 📬 HTTP Method: ${req.method}
        // 📝 Referrer: ${req.get('Referrer') || req.get('Referer') || 'N/A'}
        // 🧠 User-Agent: ${req.get('User-Agent')}
        // 📦 Headers:
        // ${JSON.stringify(req.headers, null, 2)}
        // =====================================================

        // `;
        // appendFileSync(logFilePath, logData, 'utf8');
        res.redirect('https://worlddevelopment.in');
    })

    const localAddress = require('./osModule');
    const port = 443;

    //!Importent to regenrate the list of rout and update this list manualy on every new route added. //////////////////////////////
    // function listRoutes(app) {
    //     const routes = [];
    //     app._router.stack.forEach((middleware) => {
    //         if (middleware.route) {
    //             if (middleware.route.path !== "*" && middleware.route.path !== "/chatcreate") {
    //                 routes.push(middleware.route.path);
    //             }
    //         }
    //     });
    //     return routes;
    // }
    // console.log("List of Routes and Methods:", listRoutes(app));

    server.listen(port, localAddress.setAddress(), () => {
        console.log(`Server is running on http://${localAddress.setAddress()}:${port}`);
    });
});
