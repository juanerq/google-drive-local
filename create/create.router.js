const express = require("express");
const router = express.Router()
const createHttpHandler = require("./create.http")
const validatePathContent = require('../validators/validatePath')
const { check, validationResult } = require('express-validator')

router.route('/:path?')
    .post([
        check('name', 'Name is missing').isString().not().isEmpty(),
        check('restype', 'Wrong retype. Options: directory - file').isIn(['directory', 'file']),
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(errors.array())
            }
            next()
        }
    ], validatePathContent, createHttpHandler.createDir)

exports.router = router