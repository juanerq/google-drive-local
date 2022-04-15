const express = require("express");
const router = express.Router();
const uploadFilesHttpHandler = require("./upload.http");

router.route('/:path?')
    .put( uploadFilesHttpHandler.uploadFiles );

exports.router = router;