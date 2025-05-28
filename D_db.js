// database name: desktop_app
// collection name = user
const { mkdir, mkdirSync } = require('fs');
const { join } = require('path');
require('dotenv').config();
const {
    MONGO_PASS,
    ORIGENS_ID
} = process.env;
const { MongoClient, ObjectId } = require('mongodb');
const mongo_password = encodeURIComponent(MONGO_PASS);
const uri = `mongodb+srv://apurve2014:${mongo_password}@chatsuport.suprwbc.mongodb.net/?retryWrites=true&w=majority&appName=chatSuport`;

async function newConnection() {
    try {
        const client = new MongoClient(uri);
        await client.connect
        const db = client.db('desktop_app');
        const collection = db.collection('users');
        return { collection, client }
    } catch (err) {
        console.log("error in new connection : ", err);
    }
}

async function Login_Check(obj) {
    try {
        const { email, password, sessionId } = obj;
        const { collection, client } = await newConnection();
        let user = await collection.findOne(
            {
                'Email': email,
                'Password': password
            },
            {
                projection: {
                    _id: 1
                }
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

async function logOut_User(sessionId) {
    const { collection, client } = await newConnection();
    let user = await collection.updateOne({ 'sessionId': sessionId }, { $set: { 'sessionId': "" } })
    if (user.matchedCount === 1 && user.modifiedCount === 1) {
        return true;
    } else {
        return false;
    }
}

async function userId_DirName(connectionId) {
    const { collection, client } = await newConnection();
    const userId = await collection.findOne({ socketId: connectionId }, { projection: { _id: 1 } });
    console.log("Projection Giving me this Object agains Query : ", userId);
    client.close();
    return userId._id;
}

async function update_socket(recordId, connectionId) {
    try {
        const { collection, client } = await newConnection();
        const user = await collection.findOneAndUpdate(
            { _id: new ObjectId(recordId) },
            { $set: { socketid: connectionId } },
            {
                returnDocument: 'after',
                projection: {
                    _id: 0,
                    sessionId: 1,
                }
            }
        );
        client.close();
        return user.sessionId;
    } catch (err) {
        console.log("error in update_socket function in D_db.js file : ", err);
        return false;
    }
}

// update_socket('68273d3aed82e31d5cf55d1c', '2323qw312').then((result) => {
//     console.log("result : ", result);
// }).catch((err) => {
//     console.log(err);
// })

async function add_my_project(projectName, userId) {
    const { collection, client } = await newConnection();
    try {
        const result = await collection.updateOne(
            {
                _id: new ObjectId(userId)
            },
            {
                $push: {
                    Projects: projectName
                }
            },
        );
        client.close();
        console.log("Result for update Uploaded Project : ", result);
        if (result.acknowledged === true && result.matchedCount === 1) {
            return true;
        }
        else {
            return false;
        }
    } catch (err) {
        console.log("Error while update User Project : ", err);
        return false;
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
    console.log("Result of Signup : ", result);
    if (result.upsertedCount === 1) {
        const userFolderPath = join(__dirname, "Tute", result.upsertedId.toString());
        mkdir(userFolderPath, (err) => {
            if (err) {
                return console.error('Error creating directory:', err);
            }
            console.log("folder Created : ", result.upsertedId.toString());
        });
        return result.upsertedId.toString();
    } else {
        return false;
    }

}

async function deleteAllOtherUsers() {
    const { collection, client } = await newConnection();
    const deletedThing = await collection.deleteMany({ Email: { $ne: "test@example.com" } })
    console.log("Deleted this : ", deletedThing);
    client.close();

}
// deleteAllOtherUsers();

// async function GetData() {
// const { collection, client } = await newConnection();
// const userId = await collection.findOne(
//     {
//         'sessionId': '2QTTQwBJ6N3tSgA2mnj2j-uzPON3ccDP'
//     },
//     {
//         projection: { '_id': 1, 'Email': 0, 'Password': 0,  0, 'sessionId': 0 }
//     }
// );
// console.log("in Db File userId is : ", userId._id.toString());
// console.log(await logedIn_Id('2QTTQwBJ6N3tSgA2mnj2j-uzPON3ccDP'));
// }

// GetData();
// Login_Check({ 'email': "test@example.com", 'password': "passsword123" }).then((result) => {
//     console.log("result : ", result)
// }).catch(err => {
//     console.log(err);
// })

// async function testUpsert() {
//     const newUser = {
//         Email: "exa12mple@email.com",
//         Name: "John Doe",
//         Age: 30,
//         myList: []
//     };
//     const { collection, client } = await newConnection();
//     let result = await collection.updateOne(
//         { Email: newUser.Email },            // Filter by Email
//         { $setOnInsert: newUser },           // Only insert if not found
//         { upsert: true }
//     );
//     console.log("Result Testing Upcert", result);
//     client.close();
// }

// testUpsert();
module.exports = { userId_DirName, signup_user, Login_Check, logOut_User, update_socket, add_my_project }