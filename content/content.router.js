const express = require("express");
const router = express.Router();
const contentHttpHandler = require("./content.http");

router.route('/:path?')
    .get(contentHttpHandler.dirContent);

exports.router = router;