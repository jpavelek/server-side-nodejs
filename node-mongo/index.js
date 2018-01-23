const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const dboper = require("./operations");
const url = "mongodb://localhost:27017/dishes";

MongoClient.connect(url, (err, db) => {
    assert.equal(err, null);

    console.log("Connected to the server");
    
    dboper.inserDocument(db, { name: "Pizza", description: "Yummy" }, "dishes", (result) => {
        console.log("Insert doc:\n", result.ops);

        dboper.findDocuments(db, "dishes", (docs) => {
            console.log("Found docs:\n", docs);

            dboper.updateDocument(db, { name: "Pizza" }, { description: "Updated delicious!"}, "dishes", (result) => {
                console.log("Update doc:\n", result.result);

                dboper.findDocuments(db, "dishes", (docs) => {
                    console.log("Found UPDATED docs:\n", docs);

                    db.dropCollection("dishes", (result) => {
                        console.log("Dropped collection ", result);

                        db.close();
                    });
                });
            });
        });
    });
});