const router = require("express").Router()
const contentHttpHandler = require("./content.http")
const { validatePathContent } = require('../validators/validators')

router.route('/:path?')
    .get(validatePathContent, contentHttpHandler.dirContent)

module.exports = router