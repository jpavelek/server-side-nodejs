const express = require("express");
const bodyParser = require("body-parser");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//Router for general /dishes
dishRouter.route("/")
.all((req, resp, next) => {
    resp.statusCode = 200;
    resp.setHeader("Content-Type", 'text/plain');
    next();
})
.get((req, resp, next) => {
    resp.end("Will send all the dishes later");
})
.post((req, resp, next) => {
    resp.end("Will add dish: " + req.body.name + " with data " + req.body.description);
})
.put((req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported");
})
.delete((req, resp, next) => {
    resp.end("Delete all the dishes!");
});


//Router for /dishes/:dishId
dishRouter.route("/:dishId")
.get((req, resp, next) => {
    resp.end("Will send details of " + req.params.dishId);
})
.post((req, resp, next) => {
    resp.statusCode = 403;
    resp.end("POST operation not supported on /dishes/" + req.params.dishId);
})
.put((req, resp, next) => {
    resp.write("Updating dish " + req.params.dishId + "\n");
    resp.end("Will update dish " + req.body.name + " with description: " + req.body.description);
})
.delete((req, resp, next) => {
    resp.end("Deleting dish " + req.body.name);
});

module.exports = dishRouter;