const { encrypt, decrypt } = require('./EncriptDecript');
require('dotenv').config();
const {
    MONGO_PASS,
    ORIGENS_ID
} = process.env;
const { MongoClient, ObjectId } = require('mongodb');
const mongo_password = encodeURIComponent(MONGO_PASS);
const uri = `mongodb+srv://apurve2014:${mongo_password}@chatsuport.suprwbc.mongodb.net/?retryWrites=true&w=majority&appName=chatSuport`;
const client = new MongoClient(uri);

async function newConnection() {
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
async function Login_Check(obj) {
    try {
        //Here I will create new type of session Id to send
        const { email, password, sessionId } = obj;
        const { collection, client } = await newConnection();
        let user = await collection.findOneAndUpdate(
            {
                'Email': email,
                'Password': password
            },
            { $set: { sessionId: sessionId } },
            {
                returnDocument: 'after', // Return updated document
                projection: { _id: 1, sessionId: 0 } // Return only _id and sessionId
            }
        );
        client.close();
        if (user) {
            return user._id.toString();
        } else {
            return false;
        }
    } catch (err) {
        console.log("Error is db file :", err);
    }
}

async function signup_user(newUser) {
    const { collection, client } = await newConnection();
    let result = await collection.updateOne(
        { Email: newUser.Email },
        { $setOnInsert: newUser },
        { upsert: true }
    );
    client.close();
    if (result.upsertedCount === 1) {
        const userFolderPath = join(__dirname, "Tute", result.upsertedId.toString());
        mkdir(userFolderPath, (err) => {
            if (err) {
                return console.error('Error creating directory:', err);
            }
        });
        return result.upsertedId.toString();
    } else {
        return false;
    }
}
module.exports = { Login_Check, signup_user }