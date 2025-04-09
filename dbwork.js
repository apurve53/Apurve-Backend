require("dotenv").config();
const {
  MONGO_PASS,
  ORIGENS_ID
} = process.env;
const { MongoClient, ObjectId } = require('mongodb');
const mongo_password = encodeURIComponent(MONGO_PASS);
const uri = `mongodb+srv://apurve2014:${mongo_password}@chatsuport.suprwbc.mongodb.net/?retryWrites=true&w=majority&appName=chatSuport`;
const client = new MongoClient(uri);
async function run(data) {
  try {
    console.table(data);
    await client.connect();
    dbName = data["db"];
    collectionName = data["collection"];
    let opration = data["opration"];
    let document = data["document"];
    let database = client.db(dbName);
    switch (opration) {
      case "insert":
        console.log("opration is insert");
        createDocument(database, collectionName, document, client);
        break;
      case "update":
        updateDocument(database, collectionName, filter, update, client);
        break;
      case "delete":
        console.log("Variable is value3");
        break;
      case "find":
        console.log("Variable is value3");
        break;
      case "paymentInsert":
        console.log("Variable is paymentInsert");
        handlePayment(database, collectionName, document, client);
        break;
      default:
        console.log("Opration does not match any case");
    }
  } finally {
    console.log("closing Connetion");
    // await client.close();
  }
}

async function handlePayment(database, collectionName, document, connection) {
  console.log("handling Payment");

  const collection = database.collection(collectionName);
  const result = await collection.insertOne(document);
  console.table(result);
  await connection.close();
}
// run({
//   db: "artist",
//   collection: "payment",
//   opration: "insert",
//   document: {
//     platform: "Youtube",
//     amount: "2313",
//     yearofpay: "2024",
//     monthofpay: "March",
//     user: "as@gmail.com",
//   },
// });
async function createDocument(database, collectionName, document, connection) {
  try {
    const collection = database.collection(collectionName);
    const usercollection = database.collection("user");
    const result = await collection.insertOne(document);
    console.log("document inserted :", result);
    const user = document["user"];
    const filter = { username: user };
    if (
      collectionName == "content_id_request" ||
      collectionName == "artist_channel_request" ||
      collectionName == "claim_relese"
    ) {
      let update =
        collectionName === "content_id_request"
          ? { $push: { contentidrequests: result.insertedId } }
          : { $push: { youtubeoac: result.insertedId } };
      update =
        collectionName === "claim_relese"
          ? { $push: { clamrelese: result.insertedId } }
          : update;
      let updateResult = await usercollection.updateOne(filter, update);
      console.table(updateResult);
      await connection.close();
    }
  } catch (err) {
    console.error("Error inserting document:", err);
    console.trace();
  }
}

async function readDocuments(database, collectionName, query) {
  const collection = database.collection(collectionName);
  const documents = await collection.find(query).toArray();
  console.log("Documents:", documents);
}
async function updateDocument(
  database,
  collectionName,
  filter,
  update,
  connection
) {
  const collection = database.collection(collectionName);
  const result = await collection.updateOne(filter, { $set: update });
  console.log(
    `Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`
  );
  connection.close();
}
async function deleteDocument(database, collectionName, filter, connection) {
  const collection = database.collection(collectionName);
  const result = await collection.deleteOne(filter);
  await connection.close();
  console.log(`Deleted ${result.deletedCount} document(s)`);
}

const insertDocument = (doc) => {
  console.log("runing;");
  run(doc);
};
const updateData = async (doc) => {
  await client.connect();
  let db = client.db("artist");
  updateDocument(db, doc.collection, doc.filter, doc.update, client);
};
const deleteData = async (doc) => {
  await client.connect();
  let db = client.db("artist");
  deleteDocument(db, doc.collection, doc.filter, client);
};
module.exports = {
  insertDocument,
  updateData,
  deleteData,
};
