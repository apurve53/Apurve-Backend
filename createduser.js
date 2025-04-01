const createdUsers = new Map();
let payment1 = new Map();
payment1.set("Youtube", [{ pay: 10, time: "November 2023", "yearofpay": "2023", "monthofpay": "November" }, { pay: 30, time: "December 2023", "yearofpay": "2023", "monthofpay": "December" }]);
payment1.set("Prime Music", [{ pay: 10, time: "November 2023", "yearofpay": "2023", "monthofpay": "November" }, { pay: 30, time: "December 2023", "yearofpay": "2023", "monthofpay": "December" }]);
let payment2 = new Map();
let tempReleseObject = {
    link: 'https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DFk_DsLnBzZo%26list%3DRDMMFk_DsLnBzZo%26start_radio%3D1',
    status: 'Pending',
    resion: ""
};
let tempReleseObject1 = {
    link: encodeURIComponent('https://www.youtube.com/watch?v=SymkieEeGTs'),
    status: 'Pending',
    resion: ""

};
let tempReleseObject2 = {
    link: encodeURIComponent('https://www.youtube.com/watch?v=iXyI0Cok_Zw'),
    status: 'Pending',
    resion: ""
};

let file1 = {
    "audio": "128-Urvashi - Ikka 128 Kbps.mp3",
    "img": "DSC_0109.JPG",
    "status": "Submitted",
    "artist": "Apurve"
};
let file2 = {
    "audio": "Arjan Vailly - Animal 128 Kbps.mp3",
    "img": "DSC_0109.JPG",
    "status": "Submitted",
    "artist": "Apurve"
};

createdUsers.set("admin@gmail.com", { username: "admin@gmail.com", password: "asdf" });

createdUsers.set("as@gmail.com", {
    name: 'Abhilav Srivastava',
    username: 'as@gmail.com',
    phone: '07340055790',
    address: '6-A Achrya Kriplani mare',
    password: 'asdfg',
    options: ['New Release', 'Catalogue', 'Payment'],
    ytoptions: ['Claim Release', 'Cntent ID Request', 'Artist channel Request'],
    filelist: [],
    "contentidrequests": [],
    "youtubeoac": [],
    clamrelese: [],
    payment: payment1,
    profilepic: '',
    "paymentfile": ""
});
module.exports = createdUsers;
