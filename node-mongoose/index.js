const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const Dishes = require("./models/dishes");

const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url, {
    useMongoClient: true
});

connect.then( function(db) {
    console.log("Connected to DB server");

    var newDish = Dishes({
        name: "Burger",
        description: "Buns and stuff ..."
    });

    newDish.save()
    .then( function(dish) {
        console.log(dish);

        return Dishes.find({}).exec();
    })
    .then( function(dishes) {
        console.log(dishes);

        return db.collection("dishes").drop();
    })
    .then( function() {
        return db.close();
    })
    .catch( function(err) {
        console.log(err);
    })
})
