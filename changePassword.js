console.log(__filename);
const { changeChatAppPassword } = require('./db');

const bcrypt = require('bcrypt');
const password = 'myPassword123';
const saltRounds = 10;
bcrypt.hash(password, saltRounds).then((data) => {
    console.log("Hash : ", data);
    changeChatAppPassword('apurve2014@gmail.com', data);
});
// bcrypt.hash(password, 10).then((hashedPassword) => {
//     console.log("Hash : ", hashedPassword); // e.g., $2b$10$E4wMyV...
// });

// const isMatch = await bcrypt.compare('myPassword123', '$2b$10$2msFwVDlXdX7URo5Awj5AO6s9uiWGIp6rlGe8oYhAwPUGyNB00Uxa');

// bcrypt.compare('myPassword123', '$2b$10$2msFwVDlXdX7URo5Awj5AO6s9uiWGIp6rlGe8oYhAwPUGyNB00Uxa').then((isMatch) => {
//     console.log("isMatch : ", isMatch);
// });
