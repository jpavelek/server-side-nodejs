const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const multer = require("multer");
const cors = require("./cors");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const imageFileFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("You can upload only image files"), false)
    }

    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route("/")
.options(cors.corsWithOptions, (req,resp) => { resp.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("GET operation not supported on /imageUpload");
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single("imageFile"), (req, resp) => {
    resp.statusCode = 200;
    resp.setHeader("Content-Type", "application/json");
    resp.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("PUT operation not supported on /imageUpload");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, resp, next) => {
    resp.statusCode = 403;
    resp.end("DELETE operation not supported on /imageUpload");
})

module.exports = uploadRouter;