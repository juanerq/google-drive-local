const router = require('express').Router()
const viewImgHttpHandler = require('./img.http')

router.route('/:path')
  .get( viewImgHttpHandler )

module.exports = router