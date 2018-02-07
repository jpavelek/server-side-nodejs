const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const cors = require("./cors");

const Leaders = require("../models/leaders");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

//Router for general /leaders
leaderRouter.route("/")
.options(cors.corsWithOptions, (req,resp) => { resp.sendStatus(200);})
.get(cors.cors, (req, resp, next) => {
    Leaders.find({})
    .then(function(leaders) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(leaders);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
    Leaders.create(req.body)
    .then(function(leader) {
        console.log("Created leader: ", leader);
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(leader);
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
    Leaders.remove({})
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


//Router for /leaders/:leaderId
leaderRouter.route("/:leaderId")
.options(cors.corsWithOptions, (req,resp) => { resp.sendStatus(200);})
.get(cors.cors, (req, resp, next) => {
    Leaders.findById(req.params.leaderId)
    .then(function(leader) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(leader);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    });
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("POST operation not supported on /leaders/" + req.params.leaderId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
    Leaders.findOneAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then(function(leader) {
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "application/json");
        resp.json(leader);
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    });
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
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

module.exports = leaderRouter;