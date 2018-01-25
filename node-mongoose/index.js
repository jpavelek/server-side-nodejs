const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const Dishes = require("./models/dishes");

const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url, {
    useMongoClient: true
});

connect.then( function(db) {
    console.log("Connected to DB server");

    Dishes.create({
        name: "Burger",
        description: "Buns and stuff ..."
    })
    .then( function(dish) {
        console.log(dish);

        return Dishes.findByIdAndUpdate(
            dish._id, 
            { 
                $set: { description: "Updated buns and stuff"}
            }, { 
                new: true 
            })
            .exec();
    })
    .then( function(dish) {
        console.log(dish);

        dish.comments.push({
            rating: 5,
            comment: "Yahoo...",
            author: "Leo himsels"
        });

        return dish.save();
    })
    .then( function(dish) {
        console.log(dish);

        return db.collection("dishes").drop();
    })
    .then( function() {
        return db.close();
    })
    .catch( function(err) {
        console.log(err);
    });
});
