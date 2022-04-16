const router = require("express").Router()

const createHttpHandler = require("./create.http")
const { validatePathContent, validateCreateDir } = require('../validators/validators')


router.route('/:path?')
    .post( validateCreateDir, validatePathContent, createHttpHandler.createDir)

exports.router = router
