const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dishRouter = require("./routes/dishRouter");
const promoRouter = require("./routes/promoRouter");

const hostname = "localhost";
const port = 3000;

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());

//Handle REST end-points with roouters
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);

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