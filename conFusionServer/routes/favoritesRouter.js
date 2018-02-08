const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const cors = require("./cors");

const Favorites = require("../models/favorite");
const Dishes = require("../models/dishes");

const favoritesRouter = express.Router();

favoritesRouter.use(bodyParser.json());

//Router for general /favorites
favoritesRouter.route("/")
.options(cors.corsWithOptions, (req,resp) => { resp.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, resp, next) => {
    Favorites.find({})
    .populate("user")
    .populate("dishes")
    .then(function(favs) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(favs);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, resp, next) => {
    var query = { user:req.user._id };
    var options = {
        upsert: true, //Will create new favorite doc if not found
        setDefaultsOnInsert: true, //Will pre-set defaults on creation
        new: true //Return the updated doc, not the one you found
    };
    var update = {
        $set: {
            user: req.user._id,
            dishes: req.body
        }
    };
    Favorites.findOneAndUpdate(query, update, options)
    .then(function(fav) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(fav);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported on /favorites");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, resp, next) => {
    Favorites.remove({user:req.user._id})
    .then(function(res) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(res);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    })
});


//Router for general /favorites/:favId
favoritesRouter.route("/:favId")
.options(cors.corsWithOptions, (req,resp) => { resp.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, resp, next) => {
    Favorites.findOne( { user: req.user._id} )
    .populate("dishes")
    .then(function(fav) {
        var found = false;
        fav.dishes.find(function(element) {
            if (element._id.equals(req.params.favId)) {
                console.log("Found the record, returning", element);
                found = true;
                resp.statusCode = 200;
                resp.setHeader("Content-Type", "application/json");
                resp.json(element);
                
            }
        });
        if (found === false) {
            console.log("Did not find such record");
            resp.statusCode = 404;
            resp.end("Did not find any such favorite");
        }
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, resp, next) => {
    Dishes.findById(req.params.favId)
    .then(function(dish) {
        //The Dish actually exists, lets add it to the user favorites
        var query = { "user": req.user._id};
        var options = { "new": true, "upsert": true };
        var update = { "$addToSet": { "dishes": req.params.favId }}; //Add to set only if it does not already exist
        Favorites.findOneAndUpdate(query, update, options)
        .then(function(fav) {
            resp.statusCode = 200;
            resp.setHeader("Content-Type", "application/json");
            resp.json(fav);
        }, function(err) {
            next(err);
        })
        .catch(function(err) {
            next(err);
        });
    }, function(err) {
        resp.statusCode = 403;
        resp.end("This dish does not exist, not adding to favorites.");
    })
    .catch(function(err) {
        next(err);
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported on /favorites/:favId");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, resp, next) => {
    Favorites.findByIdAndRemove(req.params.favId)
    .then(function(res) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(res);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    })
});

module.exports = favoritesRouter;