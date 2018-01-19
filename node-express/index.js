const express = require("express");
const http = require("http")

const hostname = "localhost";
const port = 3000;

const app = express();

app.use((req, resp, next) => {
    console.log(req.headers);
    resp.status = 200;
    resp.setHeader("Content-Tyle", "text/html");
    resp.end("<html><body><h1>Express server</h1></body></html>")
})

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});