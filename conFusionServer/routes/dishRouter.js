const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Dishes = require("../models/dishes");
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//Router for general /dishes
dishRouter.route("/")
.get((req, resp, next) => {
    Dishes.find({})
    .then(function(dishes) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(dishes);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    })
})
.post((req, resp, next) => {
    Dishes.create(req.body)
    .then(function(dish) {
        console.log("Dish created ", dish);
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(dish);
    }, function(err) {
        next(err);
    })
    .catch( function(err) {
        next(err);
    })
})
.put((req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported");
})
.delete((req, resp, next) => {
    Dishes.remove({})
    .then( function(res) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(res);
    }, function(err) {
        next(err);
    })
    .catch( function(err) {
        next(err);
    })
});


//Router for /dishes/:dishId
dishRouter.route("/:dishId")
.get((req, resp, next) => {
    Dishes.findById(req.params.dishId)
    .then(function(dish) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(dish);
    }, function(err) {
        next(err);
    })
    .catch( function(err) {
        next(err);
    })
})
.post((req, resp, next) => {
    resp.statusCode = 403;
    resp.end("POST operation not supported on /dishes/" + req.params.dishId);
})
.put((req, resp, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then(function(dish) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(dish);
    }, function(err) {
        next(err);
    })
    .catch( function(err) {
        next(err);
    })
})
.delete((req, resp, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then( function(res) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(res);
    }, function(err) {
        next(err);
    })
    .catch( function(err) {
        next(err);
    })
});

module.exports = dishRouter;