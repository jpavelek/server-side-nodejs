const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const cors = require("./cors");

const Promotions = require("../models/promotions");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

//Router for general /promotions
promoRouter.route("/")
.options(cors.corsWithOptions, (req,resp) => { resp.sendStatus(200);})
.get(cors.cors, (req, resp, next) => {
    console.log("Getting all promotions with query ", req.query);
    Promotions.find(req.query)
    .then(function(promos) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(promos);
        console.log("And got promotions ", promos);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
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
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
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
.options(cors.corsWithOptions, (req,resp) => { resp.sendStatus(200);})
.get(cors.cors, (req, resp, next) => {
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
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("POST operation not supported on /promotions/:promoId");
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
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