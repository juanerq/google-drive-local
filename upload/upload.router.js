const router = require("express").Router()
const uploadFilesHttpHandler = require("./upload.http")
const { validatePathContent } = require('../validators/validators')


router.route('/:path?')
  .put( validatePathContent, uploadFilesHttpHandler )

module.exports = router