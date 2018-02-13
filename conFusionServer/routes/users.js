var express = require('express');
const bodyParser = require("body-parser");
var User = require("../models/user");
var passport = require("passport");
var authenticate = require("../authenticate");
const cors = require("./cors");

var router = express.Router();
router.use(bodyParser.json());

//Router for general /users
router.options("*", cors.corsWithOptions, function(req, resp) {
  return resp.sendStatus(200);
})
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

router.post("/login", cors.corsWithOptions, function(req, resp, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      //Authentication process error
      return next(err);
    }
    if (!user) {
      //User not found or password incorrect
      resp.statusCode = 401;
      resp.setHeader("Content-Type", "application/json");
      resp.json({success: false, status: "Login failed.", err:info });
    }
    req.logIn(user, function(err) {
      if (err) {
        //User not found or password incorrect
        resp.statusCode = 401;
        resp.setHeader("Content-Type", "application/json");
        resp.json({success: false, status: "Login failed.", err: "Could not log-in user" });
      } 
      //No errors this far, all good, return token
      var token = authenticate.getToken({_id: req.user._id});
      resp.statusCode = 200;
      resp.setHeader("Content-Type", "application/json");
      resp.json( {success: true, status: "You are logged in", token: token});
    });
  })(req,resp, next);
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

router.get("/checkJWTToken", cors.corsWithOptions, function(req,resp){
  passport.authenticate("jwt", {session: false}, function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      resp.statusCode = 401;
      resp.setHeader("Content-Type", "applicatiojn/json");
      return resp.json({status: "JWT invalid!", success: false, err:info});
    } else {
      resp.statusCode = 200;
      resp.setHeader("Content-Type", "applicatiojn/json");
      return resp.json({status: "JWT valid!", success: true, user:info});
    }
  })(req, resp);
});

module.exports = router;
