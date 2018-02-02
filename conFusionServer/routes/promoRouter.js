const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");

const Promotions = require("../models/promotions");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

//Router for general /promotions
promoRouter.route("/")
.get((req, resp, next) => {
    Promotions.find({})
    .then(function(promos) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(promos);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    });
})
.post(authenticate.verifyUser, (req, resp, next) => {
    Promotions.create(req.body)
    .then(function(promo) {
        console.log("Created promo: ", promo);
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(promo);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    });
})
.put(authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported");
})
.delete(authenticate.verifyUser, (req, resp, next) => {
    Promotions.remove({})
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


//Router for general /promotions/:promoId
promoRouter.route("/:promoId")
.get((req, resp, next) => {
    Promotions.findById(req.params.promoId)
    .then(function(promo) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(promo);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    });
})
.post(authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("POST operation not supported on /promotions/:promoId");
})
.put(authenticate.verifyUser, (req, resp, next) => {
    Promotions.findOneAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
    .then(function(promo) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(promo);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    });
})
.delete(authenticate.verifyUser, (req, resp, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
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

module.exports = promoRouter;