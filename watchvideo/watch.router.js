const express = require("express");
const router = express.Router();
const watchHttpHandler = require("./watch.http");

router.route('/:path?')
    .get(watchHttpHandler.watchVideo);

exports.router = router;