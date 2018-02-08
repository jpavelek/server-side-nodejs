const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const cors = require("./cors");

const Favorites = require("../models/favorite");

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
console.log("DEBUG: Removing all favorites for user with ID ", req.user._id);
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
.get(cors.cors, (req, resp, next) => {
    Favorites.findById(req.params.favId)
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
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("POST operation not supported on /favorites/:favId");
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
    Favorites.findOneAndUpdate(req.params.favId, {
        $set: req.body
    }, { new: true })
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
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