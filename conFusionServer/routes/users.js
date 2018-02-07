var express = require('express');
const bodyParser = require("body-parser");
var User = require("../models/user");
var passport = require("passport");
var authenticate = require("../authenticate");
const cors = require("./cors");

var router = express.Router();
router.use(bodyParser.json());

//Router for general /users
router.get("/", cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
  User.find({})
  .then(function(users) {
      resp.statusCode = 200;
      resp.setHeader("Content-Type", "application/json");
      resp.json(users);
  }, function(err) {
      next(err);
  })
  .catch(function(err) {
      next(err);
  })
})



router.post("/signup", cors.corsWithOptions, function(req, resp, next) {
  User.register(new User({username:req.body.username}), req.body.password, function(err, user) {
    if (err) {
      resp.statusCode = 500;
      resp.setHeader("Content-Type", "application/json");
      resp.json({err:err});
    } else {
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save(function(err, user) {
        if (err) {
          resp.statusCode = 500;
          resp.setHeader("Content-Type", "application/json");
          resp.json({err:err});
          return;
        }
        passport.authenticate("local")(req, resp, function() {
          resp.statusCode = 200;
          resp.setHeader("Content-Type", "application/json");
          resp.json({success: true, status: "Registration successfull!"});
        });
      });
    }
  });
});

router.post("/login", cors.corsWithOptions, passport.authenticate("local"), function(req, resp, next) {
  var token = authenticate.getToken({_id: req.user._id});
  resp.statusCode = 200;
  resp.setHeader("Content-Type", "application/json");
  resp.json({success: true, token: token, status: "You are logged in"});
});

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
