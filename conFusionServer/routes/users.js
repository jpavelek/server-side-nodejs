var express = require('express');
const bodyParser = require("body-parser");
var User = require("../models/user");

var router = express.Router();
router.use(bodyParser.json());

router.post("/signup", function(req, resp, next) {
  User.findOne({username:req.body.username})
  .then(function(user) {
    if (user != null) {
      //Duplicate, already exists
      var err = new Error("User " + req.body.username + " already exists.");
      err.status = 403;
      next(err);
    } else {
      return User.create({
        username: req.body.username,
        password: req.body.password });
    }
  })
  .then(function(user) {
    resp.statusCode = 200;
    resp.setHeader("Content-Type", "application/json");
    resp.json({status: "Registration successfull!", user: user});
  }, (err) => next(err))
  .catch(function(err) {
    next(err);
  })
});

router.post("/login", function(req, resp, next) {
  if (!req.session.user) {

    var authHeader = req.headers.authorization;
    if (!authHeader) {
      var err = new Error("You are not authenticated");
      resp.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    } 

    var auth = new Buffer(authHeader.split(" ")[1], "base64").toString().split(":");
    var username = auth[0];
    var password = auth[1];

    User.findOne({username: username})
    .then(function(user) {
      if (user.username === username && user.password === password) {
        req.session.user = "authenticated";
        resp.statusCode = 200;
        resp.setHeader("Content-Type", "text/plain") ;
        resp.end("You are authenticated");
      } else if (user.password != password) {
        var err = new Error("You password is incorrect");
        resp.setHeader("WWW-Authenticate", "Basic");
        err.status = 403;
        return next(err);
      } else if (user === null) {
        var err = new Error("User " + username + " does not exist");
        resp.setHeader("WWW-Authenticate", "Basic");
        err.status = 403;
        return next(err);
      } else {
        var err = new Error("Wrong user or password");
        resp.setHeader("WWW-Authenticate", "Basic");
        err.status = 403;
        return next(err);
      }
    })
    .catch(function*(err) {
      next(err);
    })
  } else {
    //User present in req and exists in database
    resp.statusCode = 200;
    resp.setHeader("Content-Type", "text/plain");
    resp.end("You are already authenticated")
  }
})

router.get("/logout", function(req, res) {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in.");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
