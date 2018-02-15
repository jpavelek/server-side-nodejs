const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const cors = require("./cors");

const Favorites = require("../models/favorite");
const Dishes = require("../models/dishes");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

//Router for general /favorites
favoriteRouter.route("/")
.options(cors.corsWithOptions, (req,resp) => { resp.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, resp, next) => {
    Favorites.find( {user: req.user._id} )
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
        $set: { user: req.user._id, dishes: req.body }
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
favoriteRouter.route("/:favId")
.options(cors.corsWithOptions, (req,resp) => { resp.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, resp, next) => {
    Favorites.findOne( { user: req.user._id} )
    .then(function(fav) {
        if (!fav) {
            //No favorites for this user
            resp.statusCode = 200;
            resp.setHeader("Content-Type", "application/json");
            return resp.json( { "exists": false, "favorites": fav} );
        } else {
            if (fav.dishes.indexOf(req.params.favId) < 0) {
                //Did not find such favortie dish
                resp.statusCode = 200;
                resp.setHeader("Content-Type", "application/json");
                return resp.json( { "exists": false, "favorites": fav} );
            } else {
                // Correct user and existing dish favorite
                resp.statusCode = 200;
                resp.setHeader("Content-Type", "application/json");
                return resp.json( { "exists": true, "favorites": fav} );
            }
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
        if (dish != null) {
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
        } else {
            resp.statusCode = 404;
            resp.end("This dish does not exist, not adding to favorites.");
        }
    }, function(err) {
        next(err);
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
    var query = { "user": req.user._id};
    var options = { "new": true, "upsert": true };
    var update = { "$pull": { "dishes": req.params.favId }}; //Remove all instances of this favorite dish
    Favorites.findOneAndUpdate(query, update, options)
    .then(function(fav) {
        Favorites.findById(fav._id)
        .populate("user")
        .populate("dishes")
        .then(function(updatedfav) {
            resp.statusCode = 200;
            resp.setHeader("Content-Type", "application/json");
            resp.json(updatedfav);
        })
        
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    })
});

module.exports = favoriteRouter;