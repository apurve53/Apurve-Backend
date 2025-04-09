const ExcelJS = require("exceljs");
const fileUpload = require("express-fileupload");
const helper = require("./helper.js");
const uploadedMusicList = require("./uploadedMusic.js");
const userTable = require("./userTable.js");
const logedInUsers = require("./getLogedInAllUsers.js");
const app = require("./server.js");
const createdUsers = require("./createduser.js");
const submittedQueries = require("./quries.js");
const restractedUsers = new Map();
const { insertDocument, updateData, deleteData, } = require("./dbwork.js");
const allOptions = ["New Release", "Catalogue", "Payment"];
const ytOptions = ["Claim Release", "Cntent ID Request", "Artist channel Request"];
const yelloCell = ["A", "B", "C", "D", "E", "F", "G", "H", "N", "O", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE"];
const redTextCell = ["X", "Y", "Z", "AA", "AB", "AC", "AD"];
let adminPassword = "asdf";

app.use(fileUpload());

const sendLandingPage = async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.sendFile(__dirname + "//login.html");
};
const userLogin = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=0");
  if (createdUsers.has(req.body.username)) {
    if (createdUsers.get(req.body.username).password === req.body.password) {
      if (req.body.password === adminPassword) {
        logedInUsers.set(req.body.username, { time: Date.now(), session: 1 });
        res.sendFile(__dirname + "/SBM/admin.html");
      } else {
        logedInUsers.set(req.body.username, { time: Date.now(), session: 1 });
        // insertDocument({
        //   db: "artist",
        //   collection: "creds",
        //   opration: "insert",
        //   document: {
        //     username: req.body.username,
        //     password: req.body.password,
        //   },
        // });
        res.sendFile(__dirname + "/SBM/newArtist.html");
      }
    } else {
      res.send("password is wrong");
    }
  } else {
    res.send("user not found");
  }
};
const getUploads = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');
  try {
    res.setHeader("Content-Type", "application/json;charset=UTF-8");
    res.status(200).json({ fileList: createdUsers.get(req.body.user).filelist });
  } catch (err) {
    //console.error(err);
  }
};
const sendAllClameReleseToAdmin = async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');
  let allClameReleses = [];
  if (req.body.user === "admin@gmail.com") {
    res.setHeader("Content-Type", "application/json;charset=UTF-8");
    for (let [key, value] of createdUsers.entries()) {
      if (key !== "admin@gmail.com") {
        let tempObj = { ...value };
        let objToStore = {};
        delete tempObj.password;
        delete tempObj.filelist;
        objToStore[key] = tempObj;
        allClameReleses.push(objToStore);
      }
    }
    res.status(202).json(allClameReleses);
  } else {
    res.status(401);
  }
};
const artistAllClameRelese = async (req, res) => { //checked
  res.setHeader('Cache-Control', 'public, max-age=0');
  let allClameRelese = [];
  if (createdUsers.has(req.body.user)) {
    allClameRelese = createdUsers.get(req.body.user).clamrelese;
    res.setHeader("Content-Type", "application/json;charset=UTF-8");
    res.status(202).json(allClameRelese);
  } else {
    res.status(401);
  }
};
const updateClameReleseStatus = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  if (req.body.user === "admin@gmail.com") {
    let listOfclameReleseObject = createdUsers.get(req.body.statustochange.relateduser).clamrelese;
    listOfclameReleseObject.forEach(singleClam => {
      if (singleClam.link === req.body.statustochange.clamlink) {
        if (req.body.statustochange.updatedvalue === "Rejected") {
          singleClam["resion"] = req.body.statustochange.resion;
        }
        singleClam.status = req.body.statustochange.updatedvalue;
        res.status(204).end();
      }
    });
  } else {
    res.status(401).send("Unautherised");
  }
};
const artistClameRelese = async (req, res) => { //checked
  res.setHeader('Cache-Control', 'public, max-age=0');
  try {
    let reqBody = req.body;
    if (createdUsers.has(reqBody.user)) {
      let userObject = createdUsers.get(reqBody.user);
      userTable.clameRelsese({ user: reqBody.user, clame: reqBody.link });
      userObject.clamrelese.unshift({ link: reqBody.link, status: "Pending" });
      res.status(202).json({ link: reqBody.link, status: "Pending" });
    } else {
      res.status(401);
    }
  } catch (err) {
    res.status(500).send({ message: `internal server Error ${err}` });
  }
};
const submitQuery = async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');
  let query = req.body;
  if (req.files) {
    const uploadedFile = req.files.queryfile;
    query.fileName = uploadedFile.name;
    uploadedFile.mv(__dirname + "/SBMuploads/" + uploadedFile.name).then(() => { });
    // //console.log("File submitted : " + req.files.queryfile);
  } else {
    query.fileName = null;
  }
  const now = new Date();
  const options = { timeZone: "Asia/Kolkata", weekday: "short", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
  const dateFormatter = new Intl.DateTimeFormat("en-US", options);
  query.timeStamp = dateFormatter.format(now);
  submittedQueries.push(query);
  res.status(202).send({ message: "Form submitted successfully!" });
};
const sendQuires = async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  if (req.body.user === "admin@gmail.com") {
    res.status(202).send({ queries: submittedQueries });
  } else {
    res.status(401).end();
  }
};

const getExcelDownload = async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');
  if (req.body.user === "admin@gmail.com") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");
    let songNames = req.body.songname;
    let songDetail = uploadedMusicList.get(songNames[0]);
    const keysList = Object.keys(songDetail);

    sheet.addRow(keysList);
    songNames.forEach(key => {
      let song = uploadedMusicList.get(key);
      let values = Object.values(song);
      sheet.addRow(values);
    });
    yelloCell.forEach(cell => {
      const ycell = sheet.getCell(`${cell}1`);
      ycell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" }
      };
    });
    redTextCell.forEach(cell => {
      const rtcell = sheet.getCell(`${cell}1`);
      rtcell.font = {
        color: { argb: "FF0000" } // Set the color to red
      };
    });
    workbook.xlsx
      .writeFile("output.xlsx")
      .then(() => {
        //console.log("Workbook created successfully.");
      })
      .catch(err => {
        // //console.error(err);
      });
    workbook.xlsx
      .writeBuffer()
      .then(buffer => {
        res.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.set("Content-Disposition", "attachment; filename=MySheet.xlsx");
        res.status(200).send(Buffer.from(buffer));
      })
      .catch(err => {
        // //console.log("This is the error : ", err);
        res.status(500).send("Internal Server Error");
      });
  } else {
    res.status(401).send("Unautherized");
  }
};
const getAllSelectListOptions = async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  let dataList = await helper.getSelectList();
  if (dataList != null) {
    res.status(200).json(dataList);
  } else {
    res.status(404).end();
  }
};
const artistFilesUploadsWithDetails = async (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');
  console.log("function is running");

  if (createdUsers.has(req.body.user)) {
    console.log("user is there");
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send("No files were uploaded.");
      }
      if (Object.keys(req.files).length < 2) {
        res.status(304).send("Some Files are Missing.");
      }
      const uploadedFile = req.files["imagename"];
      const uploadedMusic = req.files.songname;
      let sonngName = uploadedMusic.name;
      let lastIndex = sonngName.lastIndexOf(".")
      let extention = sonngName.substring(lastIndex, sonngName.length);
      if (uploadedMusic.length === undefined) {
        let fileObject = {};
        let uploadedFileDetails = req.body;

        let fileNameToUpload = `${req.body["song title"]}${extention}`

        uploadedMusic.mv(__dirname + "/SBMuploads/" + fileNameToUpload).then(() => {
          uploadedFile.mv(__dirname + "/SBMuploads/" + uploadedFile.name).then(() => {
            fileObject["audio"] = fileNameToUpload;
            fileObject["img"] = uploadedFile.name;
            fileObject["status"] = "Submitted";
            fileObject["artist"] = req.body["ARTIST/Singer"];
            createdUsers.get(req.body.user).filelist.push(fileObject);
            uploadedFileDetails.SONG = req.body["song title"];
            uploadedFileDetails["Film Banner"] = uploadedFile.name;
            let isuploaded = setUploadedMusicToUpload(uploadedFileDetails);
            if (isuploaded) {
              res.status(201).send({ message: "File is uploaded succesfull" });
            } else {
              res.status(409).send({ message: "Conflict" });
            }
          });
        });
      } else {
        uploadedFile.mv(__dirname + "/SBMuploads/" + uploadedFile.name).then(() => { });
        for (let i = 0; i < uploadedMusic.length; i++) {
          let fileObject = {};
          let uploadedFileDetails = { ...req.body };
          let fileForUpload = uploadedMusic[i];
          fileObject["audio"] = fileForUpload.name;
          fileObject["img"] = uploadedFile.name;
          fileObject["status"] = "Submitted";
          fileObject["artist"] = req.body["ARTIST/Singer"];
          createdUsers.get(req.body.user).filelist.push(fileObject);
          uploadedFileDetails["Film Banner"] = uploadedFile.name;
          uploadedFileDetails["SONG"] = fileForUpload.name;
          uploadedMusicList.set(fileForUpload.name, uploadedFileDetails);
          if (i === uploadedMusic.length - 1) {
            fileForUpload.mv(__dirname + "/SBMuploads/" + fileForUpload.name).then(() => {
              res.status(201).send({ message: "Files are uploaded succesfull!!" });
            });
          } else {
            fileForUpload.mv(__dirname + "/SBMuploads/" + fileForUpload.name).then(() => { });
          }
        }
      }
    } catch (err) {
      // //console.log("Error processing : ", err);
    }
  } else {
    res.status(402).send({ message: "unautherised" });
  }
};

function setUploadedMusicToUpload(detailObject) {
  try {
    let finalObj = {};
    finalObj["CRBT CUTS"] = detailObject["CRBT CUTS"];
    finalObj["SONG"] = detailObject["song title"];
    finalObj["FILM/ALBUM"] = detailObject["FILM/ALBUM"];
    finalObj["ALBUM CATEGORY"] = detailObject["ALBUM CATEGORY"];
    finalObj["LANGUAGE"] = detailObject["language"];
    finalObj["GENRE/ Category"] = detailObject["GENRE/ Category"];
    finalObj["Sub Category"] = detailObject["Sub Category"];
    finalObj["Description"] = detailObject["Description"];
    finalObj["Physical File name"] = detailObject["SONG"];
    finalObj["Physical artwork name"] = detailObject["Film Banner"];
    finalObj["Track Duration"] = "";
    finalObj["Track no"] = "";
    finalObj["UPC ID"] = "";
    finalObj["DATE OF MOVIE RELEASE"] = "";
    console.log("Date Converted is :", formateDate(detailObject["DATE OF MUSIC RELEASE"]));
    finalObj["DATE OF MUSIC RELEASE"] = formateDate(detailObject["DATE OF MUSIC RELEASE"]);
    finalObj["GO LIVE DATE"] = "";
    finalObj["DATE OF EXPIRY"] = "";
    finalObj["Film Banner"] = detailObject["Film Banner"];
    finalObj["Director"] = detailObject["Director"];
    finalObj["Producer"] = detailObject["Producer"];
    finalObj["Star cast"] = detailObject["Star cast"];
    finalObj["ISRC"] = detailObject["ISRC"];
    finalObj["LABEL"] = detailObject["LABEL"];
    finalObj["Publisher"] = detailObject["Publisher"];
    finalObj["IPRS Ownership (Yes/No)"] = detailObject["IPRS"];
    finalObj["LYRICIST"] = detailObject["LYRICIST"];
    finalObj["IPRS member(Yes / No)"] = "";
    finalObj["ISWC"] = "";
    finalObj["COMPOSER"] = detailObject["composerName"];
    finalObj["ARTIST1/ Singer"] = detailObject["composerName"];
    finalObj["SOUND RECORDING RIGHTS"] = "";
    finalObj["MUSICAL & LITERARY WORKS"] = "";
    finalObj["PAY To Rights"] = "";
    finalObj["Mood"] = detailObject["Mood"];
    finalObj["Time"] = "";
    uploadedMusicList.set(detailObject.SONG, finalObj);
    return true;
  } catch (err) {
    return false;
  }
}

function formateDate(date) {
  let dateObject = new Date(date);
  if (!isNaN(dateObject.getTime())) {
    // Format the date as MM-DD-YYYY
    let formattedDate = (dateObject.getDate().toString().padStart(2, "0") + "-" + dateObject.getMonth() + 1).toString().padStart(2, "0") + "-" + dateObject.getFullYear();
    return formattedDate;
  }
}
const getAllFilesForAdmin = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');

  if (req.body.user === "admin@gmail.com") {
    let allFiles = [];
    [...createdUsers.keys()].forEach(key => {
      if (key !== "admin@gmail.com") {
        let singleUser = createdUsers.get(key);
        let tempObject = {};
        tempObject[key] = singleUser.filelist;
        allFiles.push(tempObject);
      }
    });
    res.setHeader("Content-Type", "application/json;charset=UTF-8");
    res.status(200).json({ filelist: allFiles });
  } else {
    res.status(401);
  }
};
const getUsers = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  if (req.body.user === "admin@gmail.com") {
    let listToSend = [];
    try {
      res.setHeader("Content-Type", "application/json;charset=UTF-8");
      let userList = Array.from(createdUsers.values());
      userList.splice(0, 1);
      userList.forEach(singuser => {
        let tempUserObj = {};
        tempUserObj["username"] = singuser.username;
        tempUserObj["name"] = singuser.name;
        tempUserObj["filelist"] = singuser.filelist;
        listToSend.push(tempUserObj);
      });
      res.status(200).json(listToSend);
    } catch (err) {
      res.status(400);
    }
  } else {
    res.status(401).send("unautherised");
  }
};
const createUser = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  if (req.body.user === "admin@gmail.com") {
    if (createdUsers.has(req.body.username)) {
      res.status(406).send("Email Id already Exists");
    } else {
      delete req.body.user;
      let user = req.body;
      user.filelist = [];
      user.clamrelese = [];
      user.payment = new Map();
      user.profilepic = "";
      user["options"] = req.body.options;
      console.log("Options typeof :", typeof req.body.options);
      user["ytoptions"] = req.body.ytoptions;
      if (typeof req.body.options === "string") {
        user["options"] = [];
      }
      if (typeof req.body.ytoptions === "string") {
        user["ytoptions"] = [];
      }
      user["contentidrequests"] = [];
      user["youtubeoac"] = [];
      console.log(user);
      createdUsers.set(req.body.username, user);
      userTable.newUser(user);
      res.status(201).send("User Created");
    }
  }
};

const getAlluserPayment = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');

  try {
    let finalResponse = [];
    let allUsers = Array.from(createdUsers.values());
    allUsers.forEach(userObj => {
      if (userObj.username != "admin@gmail.com") {
        let tempObject = {};
        let tempList = [];
        let paymentKeys = Array.from(userObj.payment.keys());
        paymentKeys.forEach(paymentKey => {
          let tempPayment = {};
          tempPayment[paymentKey] = userObj.payment.get(paymentKey);
          tempList.push(tempPayment);
        });
        tempObject[userObj.username] = tempList;
        finalResponse.push(tempObject);
      }
    });
    res.status(200).send(finalResponse);
  } catch (err) { }
};
const allPlatformForUser = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.setHeader("Content-Type", "application/json;charset=UTF-8");
  let payment = createdUsers.get(req.body.relateduser).payment;
  const convertedPayment = Object.fromEntries(Array.from(payment.entries()).map(([key, value]) => [key, Array.from(value)]));
  let allPlatforms = Object.keys(convertedPayment);
  res.status(200).json(allPlatforms);
};
const setNewAmountToArtist = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  let formDetail = req.body;
  let paidFor = `${req.body.monthofpay} ${req.body.yearofpay}`;
  let paymentMap = createdUsers.get(formDetail.relatedUser).payment;
  let pay = +formDetail.amount;
  let uploadedFile = req.files.excelfile;
  if (paymentMap.has(formDetail.platform)) {
    if (helper.doesValueExist(paymentMap.get(formDetail.platform), "yearofpay", req.body.yearofpay)) {
      if (helper.checkAndUpdate(paymentMap.get(formDetail.platform), "monthofpay", req.body.monthofpay, pay)) {
        res.status(201).end();
      } else {
        paymentMap.get(formDetail.platform).unshift({ paymentfile: uploadedFile.name, pay: pay, time: paidFor, yearofpay: req.body.yearofpay, monthofpay: req.body.monthofpay });
      }
    } else {
      paymentMap.get(formDetail.platform).unshift({ paymentfile: uploadedFile.name, pay: pay, time: paidFor, yearofpay: req.body.yearofpay, monthofpay: req.body.monthofpay });
    }
  } else {
    paymentMap.set(formDetail.platform, [{ paymentfile: uploadedFile.name, pay: pay, time: paidFor, yearofpay: req.body.yearofpay, monthofpay: req.body.monthofpay }]);
  }
  if (req.files != null) {
    let uploadedFile = req.files.excelfile;
    uploadedFile.mv(__dirname + "SBMuploads/" + uploadedFile.name).then(() => { });
  }
  res.status(201).end();
};

const allPaymentForUser = (req, res) => {  //checked
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  const paymentMap = createdUsers.get(req.body.user).payment;
  let paymentkeys = Array.from(paymentMap.keys());
  let paymentValues = Array.from(paymentMap.values());
  let responseObject = {};
  for (let i = 0; i < paymentkeys.length; i++) {
    responseObject[paymentkeys[i]] = paymentValues[i];
  }
  res.status(200).json(responseObject);
};
const sendUserInfo = (req, res) => {
  res.setHeader("Content-Type", "application/json;charset=UTF-8");
  let userObj = createdUsers.get(req.body.user);
  let respObj = { name: userObj.name, profilepic: userObj.profilepic, options: userObj.options, ytoptions: userObj.ytoptions };
  res.status(200).json(respObj);
};

const changeSongStatus = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  if (req.body.user === "admin@gmail.com") {
    let fileList = createdUsers.get(req.body.relateduser).filelist;
    for (let i = 0; i < fileList.length; i++) {
      let fileObj = fileList[i];
      if (fileObj.audio === req.body.songname) {
        fileObj.status = req.body.value;
        fileObj.resion = req.body.resion;
        res.status(201).send(`Changed Status for ${req.body.songname} to ${fileObj.status}`);
        break;
      }
    }
  }
}
const optionsforadmin = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  if (req.body.user === "admin@gmail.com") {
    res.status(200).json(allOptions);
  } else {
    res.end();
  }
};
const ytoptionsforadmin = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');

  if (req.body.user === "admin@gmail.com") {
    res.status(200).json(ytOptions);
  } else {
    res.end();
  }
};
const userWithOptions = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  if (req.body.user === "admin@gmail.com") {
    let allUsers = Array.from(createdUsers.keys());
    let restrictedUsers = Array.from(restractedUsers.keys());
    let tempObj = { options: allOptions, ytoptions: ytOptions, restusers: restrictedUsers };
    for (let user of allUsers) {
      if (user !== "admin@gmail.com") {
        tempObj[user] = { name: createdUsers.get(user).name, options: createdUsers.get(user).options, ytoptions: createdUsers.get(user).ytoptions };
      }
    }
    for (let user of restrictedUsers) {
      tempObj[user] = { name: restractedUsers.get(user).name, options: restractedUsers.get(user).options, ytoptions: restractedUsers.get(user).ytoptions };
    }
    res.status(200).json(tempObj);
  } else {
    res.end();
  }
  for (let user of restrictedUsers) {
    tempObj[user] = {
      name: restractedUsers.get(user).name,
      options: restractedUsers.get(user).options,
      ytoptions: restractedUsers.get(user).ytoptions,
    };
  }
  res.status(200).json(tempObj);
};
const changeOptions = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  if (req.body.user === "admin@gmail.com") {
    let addOrRemove = req.body.addorremove;
    let option = req.body.relatedoption;
    let user = req.body.relateduser;
    userObjToChange = createdUsers.get(user);
    optionListOfUser = userObjToChange.options;
    ytOptionListOfUser = userObjToChange.ytoptions;
    if (ytOptions.includes(option)) {
      addOrRemove ? ytOptionListOfUser.push(option) : ytOptionListOfUser.splice(ytOptionListOfUser.indexOf(option), 1);
    } else if (allOptions.includes(option)) {
      addOrRemove ? optionListOfUser.push(option) : optionListOfUser.splice(optionListOfUser.indexOf(option), 1);
    }
    res.status(201).json("Opration Succed");
  } else {
    res.status(401).send("Unautharized Request");
  }
};
const contentIdRequest = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  if (logedInUsers.has(req.body.user)) {
    let allRequest = createdUsers.get(req.body.user).contentidrequests;
    allRequest.push(req.body);
    res.status(201).send("Your request for Content ID Request has been Updated ");
  } else {
    res.status(402).end();
  }
};

const allYTCReq = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');

  let respObj = {};
  if (logedInUsers.has(req.body.user)) {
    for (let [user, userData] of createdUsers.entries()) {
      if (user !== "admin@gmail.com") {
        respObj[user] = userData.contentidrequests;
      }
    }
    res.status(202).json(respObj);
  } else {
    res.status(402).end();
  }
};
const removeUserYTreq = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=0");

  if (logedInUsers.has(req.body.user)) {
    let userRest = createdUsers.get(req.body.relateduser).contentidrequests;
    const indexOfObject = userRest.findIndex(
      (obj) => obj["Album Title"] === req.body.title
    );
    userRest.splice(indexOfObject, 1);
    res.status(202).end();
  } else {
    res.status(402).end();
  }
};
const allOac = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=3600");

  if (logedInUsers.has(req.body.user)) {
    let respObj = {};
    for (let [user, userData] of createdUsers.entries()) {
      respObj[user] = userData.youtubeoac;
    }
    res.status(202).json(respObj);
  } else {
    res.status(401).end();
  }
};
const createOac = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=0");

  if (logedInUsers.has(req.body.user)) {
    let user = createdUsers.get(req.body.user);
    // insertDocument({
    //   db: "artist",
    //   collection: "artist_channel_request",
    //   opration: "insert",
    //   document: req.body,
    // });
    user.youtubeoac.push(req.body);
    res.status(201).send("Your Request has been updated");
  } else {
    res.status(401).end();
  }
};
const removeoac = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=0");
  if (logedInUsers.has(req.body.user)) {
    let userRest = createdUsers.get(req.body.relateduser).youtubeoac;
    const indexOfObject = userRest.findIndex(
      (obj) => obj["Label Name"] === req.body.title
    );
    userRest.splice(indexOfObject, 1);
    res.status(202).end();
  } else {
    res.status(401).end();
  }
};
const profilepicUpload = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=0");
  if (logedInUsers.has(req.body.user)) {
    let profilePicture = req.files.profile;
    console.log("profilePicture : ", profilePicture);
    let uploadPath = __dirname + "/SBMuploads/profilepicture/" + profilePicture.name;
    console.log("Upload Path : ", uploadPath);
    profilePicture.mv(uploadPath).then(() => {
      console.log("profile Pic Uploadedd Successfully");
      if (createdUsers.get(req.body.user).profilepic !== "") {
        helper.deleteOldProfilePicture(
          createdUsers.get(req.body.user).profilepic
        );
      }
      // updateData({
      //   db: "artist",
      //   collection: "user",
      //   opration: "update",
      //   filter: { username: req.body.user },
      //   update: { profilepic: profilePicture.name },
      // });
      createdUsers.get(req.body.user).profilepic = profilePicture.name;
    }).catch((err) => {
      console.log("Error in Profile Pic Upload : ", err);
    });
    res.status(201).send("Uploaded Succssfull");
  } else {
    res.status(401).end();
  }
};
const deleteUser = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=0");
  if (req.body.user === "admin@gmail.com") {
    let opration = createdUsers.delete(req.body.relateduser);
    if (opration) {
      // deleteData({
      //   collection: "user",
      //   filter: { username: req.body.relateduser },
      // });
      res.status(201).end();
    } else {
      res.status("401").end();
    }
  }
};

const restractUser = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=0");

  if (createdUsers.has(req.body.relateduser)) {
    restractedUsers.set(
      req.body.relateduser,
      createdUsers.get(req.body.relateduser)
    );
    createdUsers.delete(req.body.relateduser);
    res.status(202).send(`${req.body.relateduser} is restricted now`);
  } else {
    createdUsers.set(
      req.body.relateduser,
      restractedUsers.get(req.body.relateduser)
    );
    restractedUsers.delete(req.body.relateduser);
    res.status(202).send(`${req.body.relateduser} can login now`);
  }
};

const logout = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=0");

  logedInUsers.delete(req.body.user);
  res.redirect("/");
};

const adminChangePassword = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=0");

  if (req.body.user === "admin@gmail.com") {
    let adminAcc = createdUsers.get(req.body.user);
    if (adminAcc.password === req.body.oldpassword) {
      if (req.body.confirmpassword === req.body.newpassword) {
        adminPassword = req.body.newpassword;
        adminAcc.password = req.body.newpassword;
        res.status(202).send("Password has been changed");
      } else {
        res.send("New Password is not Matched with Confirm Password");
      }
    } else {
      res.send("Old Password is Wrong");
    }
  } else {
    res.end();
  }
};

const downloadPaymentDetail = async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=0");
  if (createdUsers.has(req.body.user)) {
    let paymentMap = createdUsers.get(req.body.user).payment;
    let platformAllPayment = paymentMap.get(req.body.platform);
    const foundObject = platformAllPayment.find(
      (obj) =>
        obj["yearofpay"] === req.body.year &&
        obj["monthofpay"] === req.body.month
    );
    let fileName = foundObject.paymentfile;
    if (fileName !== "") {
      const selectListWorkBook = new ExcelJS.Workbook();
      await selectListWorkBook.xlsx.readFile(
        __dirname + "/SBMuploads/" + fileName
      );
      selectListWorkBook.xlsx
        .writeBuffer()
        .then((buffer) => {
          res.set(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.set(
            "Content-Disposition",
            "attachment; filename=Payment Details.xlsx"
          );
          res.status(200).send(Buffer.from(buffer));
        })
        .catch((err) => {
          res.status(500).send("Internal Server Error");
        });
    }
  } else {
    res.status(401).send("Unautherized");
  }
};

module.exports = {
  sendLandingPage,
  userLogin,
  sendAllClameReleseToAdmin,
  artistAllClameRelese,
  updateClameReleseStatus,
  artistClameRelese,
  submitQuery,
  sendQuires,
  getExcelDownload,
  getAllSelectListOptions,
  artistFilesUploadsWithDetails,
  getUploads,
  getAllFilesForAdmin,
  getUsers,
  createUser,
  getAlluserPayment,
  allPlatformForUser,
  setNewAmountToArtist,
  allPaymentForUser,
  sendUserInfo,
  changeSongStatus,
  optionsforadmin,
  ytoptionsforadmin,
  userWithOptions,
  changeOptions,
  contentIdRequest,
  allYTCReq,
  removeUserYTreq,
  allOac,
  createOac,
  removeoac,
  profilepicUpload,
  deleteUser,
  restractUser,
  logout,
  adminChangePassword,
  downloadPaymentDetail,
};
