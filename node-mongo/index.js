const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const dboper = require("./operations");
const url = "mongodb://localhost:27017/conFusion";

MongoClient.connect(url).then((db) => {
    console.log("Connected to the server");
    
    dboper.inserDocument(db, { name: "Pizza", description: "Yummy" }, "dishes")
    .then((result) => {
        console.log("Inserted doc:\n", result.ops);

        return dboper.findDocuments(db, "dishes");
    })
    .then((docs) => {
        console.log("Found docs:\n", docs);

        return dboper.updateDocument(db, { name: "Pizza" }, { description: "Updated delicious!"}, "dishes");
    })
    .then((result) => {
        console.log("Updated doc:\n", result.result);

        return dboper.findDocuments(db, "dishes");
    })
    .then((docs) => {
        console.log("Found UPDATED docs:\n", docs);

        return db.dropCollection("dishes");
    })
    .then((result) => {
        console.log("Dropped collection ", result);

        return db.close();
    })
    .catch((err) => console.log(err));

})
.catch((err) => console.log(err));