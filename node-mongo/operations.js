const assert = require("assert");

exports.inserDocument = function(db, document, collection, callback) {
    const coll = db.collection(collection);
    coll.insert(document, (err, result) => {
        assert.equal(err, null);

        console.log("Inserted " + result.result.n + " docs into " + collection);
        callback(result);
    });
};

exports.findDocuments = function(db, collection, callback) {
    const coll = db.collection(collection);
    coll.find({}).toArray( (err, docs) => {
        assert.equal(err, null);
        callback(docs);
    });
};

exports.removeDocument = function(db, document, collection, callback) {
    const coll = db.collection(collection);
    coll.deleteOne(document, (err, result) => {
        assert.equal(err, null);
        console.log("Removed doc ", document);
        callback(result);
    });
};

exports.updateDocument = function(db, document, update, collection, callback) {
    const coll = db.collection(collection);
    coll.updateOne(document, { $set: update }, null, (err, result) => {
        assert.equal(err, null);
        console.log("Updated doc with ", update);
        callback(result);
    });
};