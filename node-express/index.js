const express = require("express");
const http = require("http");
const morgan = require("morgan");


const hostname = "localhost";
const port = 3000;

const app = express();
app.use(morgan("dev"));

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