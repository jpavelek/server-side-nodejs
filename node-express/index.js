const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");


const hostname = "localhost";
const port = 3000;

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());

app.all("/dishes", (req, resp, next) => {
    resp.statusCode = 200;
    resp.setHeader("Content-Type", 'text/plain');
    next();
});

app.get("/dishes", (req, resp, next) => {
    resp.end("Will send all the dishes later");
});

app.post("/dishes", (req, resp, next) => {
    resp.end("Will add dish: " + req.body.name + " with data " + req.body.description);
});

app.put("/dishes", (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported");
});

app.delete("/dishes", (req, resp, next) => {
    resp.end("Delete all the dishes!");
});

app.get("/dishes/:dishId", (req, resp, next) => {
    resp.end("Will send details of " + req.params.dishId);
});

app.post("/dishes/:dishId", (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("POST operation not supported on /dishes/" + req.params.dishId);
});

app.put("/dishes/:dishId", (req, resp, next) => {
    resp.write("Updating dish " + req.params.dishId + "\n");
    resp.end("Will update dish " + req.body.name + " with description: " + req.body.desription);
});

app.delete("/dishes/:dishId", (req, resp, next) => {
    resp.end("Deleting dish " + req.body.name);
});

//Serve static webpages from location relateive to current working dir
app.use(express.static(__dirname + "/public"));

app.use((req, resp, next) => {
    resp.status = 200;
    resp.setHeader("Content-Type", "text/html");
    resp.end("<html><body><h1>Express server</h1></body></html>")
})

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});