const assert = require("assert");

exports.inserDocument = function(db, document, collection) {
    const coll = db.collection(collection);
    return coll.insert(document);
};

exports.findDocuments = function(db, collection) {
    const coll = db.collection(collection);
    return coll.find({}).toArray();
};

exports.removeDocument = function(db, document, collection) {
    const coll = db.collection(collection);
    return coll.deleteOne(document);
};

exports.updateDocument = function(db, document, update, collection) {
    const coll = db.collection(collection);
    return coll.updateOne(document, { $set: update }, null);
};