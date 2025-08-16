const { encrypt, decrypt } = require('./EncriptDecript');
require('dotenv').config();
const {
    MONGO_PASS,
    ORIGENS_ID
} = process.env;
const { MongoClient, ObjectId, Collection } = require('mongodb');
const mongo_password = encodeURIComponent(MONGO_PASS);
const uri = `mongodb+srv://apurve2014:${mongo_password}@chatsuport.suprwbc.mongodb.net/?retryWrites=true&w=majority&appName=chatSuport`;
const client = new MongoClient(uri);

async function newConnection_for_users() {
    try {
        const client = new MongoClient(uri);
        await client.connect
        const db = client.db('poker_app');
        const collection = db.collection('users');
        return { collection, client }
    } catch (err) {
        console.log("error in new connection : ", err);
    }
}
async function Poker_Login_Check(obj) {
    try {
        //Here I will create new type of session Id to send
        const { email, password, sessionId } = obj;
        const { collection, client } = await newConnection_for_users();
        let user = await collection.findOneAndUpdate(
            {
                $or: [
                    { 'email': email },
                    { 'username': email }
                ],
                'password': password
            },
            { $set: { 'sessionId': sessionId } },
            {
                returnDocument: 'after', // Return updated document
                projection: { '_id': 0, 'username': 1 } // Return only _id and sessionId
            }
        );
        client.close();
        if (user) {
            console.log("get user for chek if username is there : ", user);
            return user.username;
        } else {
            return false;
        }
    } catch (err) {
        console.log("Error is db file :", err);
    }
}

async function Poker_signup_user(newUser) {
    const { collection, client } = await newConnection_for_users();
    let result = await collection.updateOne(
        {
            $or: [
                { email: newUser.email },
                { username: newUser.email }
            ]
        },
        { $setOnInsert: newUser },
        { upsert: true }
    );

    client.close();

    if (result.upsertedCount === 1) {
        return true;  // new record inserted
    } else {
        return false; // record already existed
    }
}

async function delete_poker_user(username) {
    try {
        const { collection, client } = await newConnection_for_users();
        const result = await collection.deleteOne({ 'username': username })
        if (result.deletedCount === 1) {
            return true;
        } else {
            return false;
        }
    }
    catch (err) {
        console.log("Error in Deleting User");
        return false;
    }
    finally {
        await client.close();
    }
}
let newUser = { 'username': "apurvd", 'email': '1ssdfaps@gmai.on', 'password': encrypt('asdad') }

//Sign Up is Working.
// Poker_signup_user(newUser)
//     .then(data => {
//         console.log("Test Insertion Poker_signup_user:", data);
//     })
//     .catch(err => {
//         console.error("Error in Poker_signup_user:", err);
//     });

async function deleteAllUsers() {
    const { collection, client } = await newConnection_for_users();
    const deleting = await collection.deleteMany({});
    console.log(deleting);
    client.close()
}

deleteAllUsers();

module.exports = { Poker_Login_Check, Poker_signup_user, delete_poker_user }