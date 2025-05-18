// database name: desktop_app
// collection name = user
require('dotenv').config();
const {
    MONGO_PASS,
    ORIGENS_ID
} = process.env;
const { MongoClient, ObjectId } = require('mongodb');
const mongo_password = encodeURIComponent(MONGO_PASS);
const uri = `mongodb+srv://apurve2014:${mongo_password}@chatsuport.suprwbc.mongodb.net/?retryWrites=true&w=majority&appName=chatSuport`;

async function newConnection() {
    const client = new MongoClient(uri);
    await client.connect
    const db = client.db('desktop_app');
    const collection = db.collection('users');
    return { collection, client }
}
async function Login_Check(obj) {
    try {
        const { email, password, sessionId } = obj;
        const { collection, client } = await newConnection();
        let user = await collection.updateOne({ 'Email': email, 'Password': password }, { $set: { 'sessionId': sessionId } });
        client.close();
        if (user.matchedCount === 1 && user.modifiedCount === 1) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log("Error is db file :", err);
    }
}
// Login_Check({ 'email': "test@example.com", 'password': "passsword123" }).then((result) => {
//     console.log("result : ", result)
// }).catch(err => {
//     console.log(err);
// })
module.exports = { Login_Check }