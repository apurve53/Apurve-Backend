const { encrypt, decrypt } = require('./EncriptDecript');
const { processChatData, checkSingleChatFromUsersChatData } = require('./AI');
const { getTime } = require('./t');
require('dotenv').config();
const {
  MONGO_PASS,
  ORIGENS_ID
} = process.env;
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
const mongo_password = encodeURIComponent(MONGO_PASS);
const uri = `mongodb+srv://apurve2014:${mongo_password}@chatsuport.suprwbc.mongodb.net/?retryWrites=true&w=majority&appName=chatSuport`;
const client = new MongoClient(uri);

async function insertUser(user) {
  await client.connect();
  const database = client.db('chatdata');
  const collection = database.collection('user');
  let insertion = await collection.insertOne(user);
  let dataCollection = database.collection('data');
  const id = new ObjectId(ORIGENS_ID);
  if (insertion.acknowledged) {
    await collection.updateOne(
      { _id: id },
      { $push: { origins: user["website"] } }
    );
    return insertion.acknowledged
  } else {
    return insertion.acknowledged;
  }
}

async function changeChatAppPassword(userName, password) {
  await client.connect();
  const database = client.db('chatdata');
  const collection = database.collection('user');
  const isUpdated = await collection.updateOne({ "username": userName }, { $set: { 'password': password } });
  console.log("password changed : ", isUpdated);
}
async function findUser(username, pass) {
  await client.connect();
  const database = client.db('chatdata');
  const collection = database.collection('user');
  const user = await collection.findOne({ "username": username });
  if (!user) {
    return {
      'message': 'Error logging in', 'status': 401
    }
  }
  try {
    const match = await bcrypt.compare(pass, user.password)
    if (match) {
      return {
        'user': username
      }
    } else {
      return {
        'message': "Password not match", 'status': 401
      }
    }
  } catch (error) {
    return { "message": 'Error logging in ' }
  }
}
async function checkUser(username) {
  await client.connect();
  let database = client.db('chatdata');
  let collection = database.collection('user')
  // let user = await collection.findOne({ "username": username })
  let user = await collection.findOne({ "username": username });
  if (user !== null) {
    return true
  } else {
    return false;
  }
}

async function addUserChat(userchat) {
  try {
    await client.connect();
    let database = client.db('chatdata');
    let collection = database.collection('user');
    const result = await collection.updateOne(
      { username: userchat.user },
      { $set: { chat: userchat.chat } }
    );
    return result;
  } catch (errr) {
    return {};
  }
}
async function getUserChat(userobj) {
  await client.connect();
  let database = client.db('chatdata');
  let coll = database.collection('user');
  try {
    let userData = await coll.findOne({ "username": userobj.user });
    return userData.chat;
  } catch (e) {
    console.log("Error sending user Chat : ", e);
  }
}

async function handleResetChat(userObj) {
  await client.connect();
  let database = client.db('chatdata');
  let collection = database.collection('user');
  let userChatUpdate = await collection.updateOne({ username: userObj.user }, { $set: { chat: {} } });
  return userChatUpdate.matchedCount == 1 ? true : false;
}
async function sendMessageToUser(obj) {
  try {
    await client.connect();
    let database = client.db('chatdata');
    let collection = database.collection('user');
    await collection.updateOne({ username: obj.user }, { $set: { Message: obj["Message"] } })
  } catch (e) {
    console.log("Error while Setting Message to User", e);
  }
}

async function addSocketClient(details) {
  try {
    await client.connect();
    let database = client.db('chatdata');
    let collection = database.collection('user');
    const chatConnections_Object = {};
    chatConnections_Object[details.clientSocketId] = "";
    let isUpdate = await collection.updateOne(
      { username: details.user_name },
      { $push: { chatConnections: chatConnections_Object } }
    );
  } catch (e) {
    console.log("Error while Setting Message to User", e);
  }
}

async function addClientChat(chatObject) {
  let database = client.db('chatdata');
  let collection = database.collection('userchat');
  if (Object.keys(chatObject).includes("to")) {
    let userClientChatUpdate = await collection.updateOne({ 'user': chatObject['user'], 'from': chatObject['to'] }, { $push: { 'chat': { 'to': chatObject['to'], 'chat': chatObject.chat } } })
  } else {
    let userClientChatUpdate = await collection.updateOne({ 'user': chatObject['user'], 'from': chatObject['from'] }, { $push: { 'chat': { 'from': chatObject['from'], 'chat': chatObject.chat } } })
    if (userClientChatUpdate.matchedCount !== 1) {
      let isInsertChat = await collection.insertOne({ 'user': chatObject['user'], 'from': chatObject['from'], 'isOnline': "green", 'chat': [{ 'from': chatObject['from'], 'chat': chatObject.chat }] });
    }
    let user = decrypt(chatObject['user']);
    let userChatData = await getUserChat({ "user": user })
    // let modelResult = checkSingleChatFromUsersChatData({ "user": user, "singleChat": chatObject.chat, "chatData": userChatData })
  }
  return chatObject['to'] ? chatObject['to'] : chatObject['from'];
}

async function changeOnlineStatus(relatedSocket) {
  let database = client.db('chatdata');
  let collection = database.collection('userchat');
  let onlineStatus = await collection.updateOne({ 'from': relatedSocket }, { $set: { 'isOnline': 'red' } });
  return onlineStatus.matchedCount;
}

async function getAllChatOfAdminUser(userObj) {
  let database = client.db('chatdata');
  let collection = database.collection('userchat');
  let userChat = await collection.find({ user: userObj.user }).toArray();
  return userChat;
}

async function removeClientChat(userSocketId) {
  let database = client.db('chatdata');
  let collection = database.collection('userchat');
  let isDeleted = await collection.deleteOne({ from: userSocketId });
  return isDeleted;
}

async function getSampleChat() {
  await client.connect();
  let database = client.db('chatdata');
  let collection = database.collection('data');
  let sampleChat = await collection.findOne({ 'type': "For a Web Developer" });
  return sampleChat;
}

function getOrigins() {
  let database = client.db('chatdata');
  let collection = database.collection('user');
  return collection.find({}, { projection: { website: 1, _id: 0 } }).toArray().then((listOfWebsites) => {
    let originList = [];
    for (let i = 0; i < listOfWebsites.length; i++) {
      // console.log(listOfWebsites[i]);
      if (listOfWebsites[i].website) {
        originList.push(listOfWebsites[i].website);
      }
    }
    return originList;
  }).catch((error) => {
    console.error("Error fetching origins:", error);
    throw error; // Re-throw the error for the caller to handle
  });
}

getOrigins()

async function test_getOrigins() {
  let database = client.db('chatdata');
  let collection = database.collection('user');
  let data1 = await collection.find({}).toArray();

  // let data = await collection.find({}).toArray();
  console.log("data : ", data1);
  // console.log("data : ", data1);
  // return originList;
}
// test_getOrigins()

async function getAllChatForAI(userName) {
  let database = client.db('chatdata');
  let collection = database.collection('userchat');
  let collection2 = database.collection('user');
  const dirChat = await collection.find({ user: userName }, { projection: { chat: 1, _id: 0 } }).toArray();
  const cbData = await collection2.findOne({ username: decrypt(userName) }, { projection: { "chat": 1, _id: 0 } });
  // const cbData = await collection2.findOne({ username: "apurve2014@gmail.com" }, { projection: { "chat": 1, _id: 0 } });
  let records = { 'directChat': dirChat, 'chatBotChat': cbData['chat'] };
  // console.log("records : ", JSON.stringify(records));
  let similerities = await processChatData(records);
  console.log(`similerities in db.js : ${JSON.stringify(similerities)} on ${getTime()}`);
  return similerities;
}

// console.log(getSampleChat());

module.exports = { changeChatAppPassword, getAllChatForAI, getOrigins, removeClientChat, changeOnlineStatus, getAllChatOfAdminUser, addClientChat, addSocketClient, sendMessageToUser, insertUser, findUser, checkUser, addUserChat, getUserChat, handleResetChat, getSampleChat };