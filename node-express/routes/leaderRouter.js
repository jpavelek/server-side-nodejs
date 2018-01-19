const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

//Router for general /leaders
leaderRouter.route("/")
.all((req, resp, next) => {
    resp.statusCode = 200;
    resp.setHeader("Content-Type", 'text/plain');
    next();
})
.get((req, resp, next) => {
    resp.end("Will send all the leaders later");
})
.post((req, resp, next) => {
    resp.end("Will add leader: " + req.body.name + " with data " + req.body.description);
})
.put((req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported");
})
.delete((req, resp, next) => {
    resp.end("Delete all the leaders!");
});


//Router for /leaders/:leaderId
leaderRouter.route("/:leaderId")
.get((req, resp, next) => {
    resp.end("Will send details of leader " + req.params.leaderId);
})
.post((req, resp, next) => {
    resp.statusCode = 403;
    resp.end("POST operation not supported on /leaders/" + req.params.leaderId);
})
.put((req, resp, next) => {
    resp.write("Updating leader " + req.params.leaderId + "\n");
    resp.end("Will update leader " + req.body.name + " with description: " + req.body.description);
})
.delete((req, resp, next) => {
    resp.end("Deleting leader " + req.params.leaderId);
});

module.exports = leaderRouter;