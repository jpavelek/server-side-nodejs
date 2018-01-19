const express = require("express");
const bodyParser = require("body-parser");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

//Router for general /promotions
promoRouter.route("/")
.all((req, resp, next) => {
    resp.statusCode = 200;
    resp.setHeader("Content-Type", 'text/plain');
    next();
})
.get((req, resp, next) => {
    resp.end("Will send all the promotions later");
})
.post((req, resp, next) => {
    resp.end("Will add promotion: " + req.body.name + " with data " + req.body.description);
})
.put((req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported");
})
.delete((req, resp, next) => {
    resp.end("Delete all the promotions!");
});


//Router for /promotions/:promoId
promoRouter.route("/:promoId")
.get((req, resp, next) => {
    resp.end("Will send details of promotion " + req.params.promoId);
})
.post((req, resp, next) => {
    resp.statusCode = 403;
    resp.end("POST operation not supported on /promotions/" + req.params.promoId);
})
.put((req, resp, next) => {
    resp.write("Updating promotion " + req.params.promoId + "\n");
    resp.end("Will update promotion " + req.body.name + " with description: " + req.body.description);
})
.delete((req, resp, next) => {
    resp.end("Deleting promotion " + req.params.promoId);
});

module.exports = promoRouter;