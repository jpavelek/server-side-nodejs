const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");

const Dishes = require("../models/dishes");
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//Router for general /dishes
dishRouter.route("/")
.get((req, resp, next) => {
    Dishes.find({})
    .populate("comments.author")
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
.post(authenticate.verifyUser, (req, resp, next) => {
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
.put(authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported");
})
.delete(authenticate.verifyUser, (req, resp, next) => {
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
    .populate("commments.author")
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
.post(authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("POST operation not supported on /dishes/" + req.params.dishId);
})
.put(authenticate.verifyUser, (req, resp, next) => {
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
.delete(authenticate.verifyUser, (req, resp, next) => {
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

//Router for general /dishes/:dishId/comments
dishRouter.route("/:dishId/comments")
.get((req, resp, next) => {
    Dishes.findById(req.params.dishId)
    .populate("comments.author")
    .then(function(dish) {
        if (dish != null) {
            resp.statusCode = 200;
            resp.setHeader("Content-Type", "application/json");
            resp.json(dish.comments);
        } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
        }
    }, function(err) {
        next(err);
    })
    .catch(function(err) {
        next(err);
    })
})
.post(authenticate.verifyUser, (req, resp, next) => {
    Dishes.findById(req.params.dishId)
    .then(function(dish) {
        if (dish != null) {
            req.body.author = req.user._id; //This ID has been added to req when verifyUser was executed
            dish.comments.push(req.body);
            dish.save()
            .then(function(dish) {
                resp.statusCode = 200;
                resp.setHeader("Content-Type", "application/json");
                resp.json(dish);
            }, function(err) {
                next(err);
            })
        } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
        }
    }, function(err) {
        next(err);
    })
    .catch( function(err) {
        next(err);
    })
})
.put(authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported on /dishes/" + req.params.dishId);
})
.delete(authenticate.verifyUser, (req, resp, next) => {
    Dishes.findById(req.params.dishId)
    .then( function(dish) {
        if (dish != null ) {
            for (var i = (dish.comments.lenght-1);i>=0;i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then(function(dish) {
                resp.statusCode = 200;
                resp.setHeader("Content-Type", "application/json");
                resp.json(dish);
            }, function(err) {
                next(err);
            })
        } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
        }
    }, function(err) {
        next(err);
    })
    .catch( function(err) {
        next(err);
    })
});


//Router for /dishes/:dishId/comments/:commentId
dishRouter.route("/:dishId/comments/:commentId")
.get((req, resp, next) => {
    Dishes.findById(req.params.dishId)
    .populate("comments.author")
    .then(function(dish) {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            resp.statusCode = 200;
            resp.setHeader("Content-Type", "application/json");
            resp.json(dish.comments.id(req.params.commentId));
        } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
        } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
        }
    }, function(err) {
        next(err);
    })
    .catch( function(err) {
        next(err);
    })
})
.post(authenticate.verifyUser, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("POST operation not supported on /dishes/" + req.params.dishId + "/comments/" + req.params.commentId);
})
.put(authenticate.verifyUser, (req, resp, next) => {
    Dishes.findById(req.params.dishId)
    .then(function(dish) {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then( function(dish) {
                resp.statusCode = 200;
                resp.setHeader("Content-Type", "application/json");
                resp.json(dish);
            }, function(err) {
                next(err);
            })
        } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
        } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
        }
    }, function(err) {
        next(err);
    })
    .catch( function(err) {
        next(err);
    })
})
.delete(authenticate.verifyUser, (req, resp, next) => {
    Dishes.findById(req.params.dishId)
    .then( function(dish) {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then(function(dish) {
                resp.statusCode = 200;
                resp.setHeader("Content-Type", "application/json");
                resp.json(dish);
            }, function(err) {
                next(err);
            })
        } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
        } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
        }
    }, function(err) {
        next(err);
    })
    .catch( function(err) {
        next(err);
    })
});


module.exports = dishRouter;