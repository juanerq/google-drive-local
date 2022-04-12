const router = require("express").Router()
const contentHttpHandler = require("./content.http")
const validatePathContent = require('../validators/validatePath')

router.route('/:path?')
    .get(validatePathContent, contentHttpHandler.dirContent)

module.exports = router