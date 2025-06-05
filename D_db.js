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

async function logOut_User(sessionId) {
    const { collection, client } = await newConnection();
    let user = await collection.updateOne({ 'sessionId': sessionId }, { $set: { 'sessionId': "" } })
    client.close();
    if (user.matchedCount === 1 && user.modifiedCount === 1) {
        return true;
    } else {
        return false;
    }
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
                    _id: 1,
                }
            }
        );
        client.close();
        return user._id;
    } catch (err) {
        console.log("error in update_socket function in D_db.js file : ", err);
        return false;
    }
}

async function get_My_Projects(userId) {
    try {
        const { collection, client } = await newConnection();
        const list = await collection.findOne({ _id: new ObjectId(userId) }, { projection: { _id: 0, Projects: 1 } });
        client.close();
        return list.Projects;

    } catch (err) {
        console.log("error on get my projects : ", err);
    }
}

async function add_my_project(newProject, userId) {
    const { collection, client } = await newConnection();
    try {
        const result = await collection.updateOne(
            {
                _id: new ObjectId(userId)
            },
            {
                $push: {
                    Projects: newProject
                }
            },
        );
        client.close();

        if (result.acknowledged === true && result.matchedCount === 1) {
            return true;
        }
        else {
            throw new Error("User not found or project not added.");
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

async function deleteAllOtherUsers() {
    const { collection, client } = await newConnection();
    const deletedThing = await collection.deleteMany({ Password: "password123", Email: { $ne: ["test@example.com", "test1@example.com", "test2@example.com"] } })
    console.log("Deleted this : ", deletedThing);
    client.close();

}
deleteAllOtherUsers();

// async function GetData() {
//     const { collection, client } = await newConnection();
//     const userId = await collection.findOne(
//         {
//             _id: new ObjectId("")
//         },
//         {
//             projection: { _id: 0, Projects: 1 }
//         }
//     );
//     console.log("in Db File userId is : ", userId._id.toString());
//     console.log(await logedIn_Id('2QTTQwBJ6N3tSgA2mnj2j-uzPON3ccDP'));
// }
// GetData();

/* 
Login_Check({ 'email': "test@example.com", 'password': "passsword123" }).then((result) => {
    console.log("result : ", result)
}).catch(err => {
    console.log(err);
})

async function testUpsert() {
    const newUser = {
        Email: "exa12mple@email.com",
        Name: "John Doe",
        Age: 30,
        myList: []
    };
    const { collection, client } = await newConnection();
    let result = await collection.updateOne(
        { Email: newUser.Email },            // Filter by Email
        { $setOnInsert: newUser },           // Only insert if not found
        { upsert: true }
    );
    console.log("Result Testing Upcert", result);
    client.close();
}

testUpsert();*/


module.exports = { get_My_Projects, signup_user, Login_Check, logOut_User, update_socket, add_my_project }