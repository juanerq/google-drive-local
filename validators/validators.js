const validatePath = require('../tools/validatepath')
const convertPath = require('../tools/convertpath')
const to = require('../tools/to')
const validateFields = require('../middlewares/validateFields')

const { check } = require('express-validator')

const validatePathContent = async (req, res, next) => {
    const pathSent = req.params.path;
    const pathComplete = convertPath(pathSent);

    // Validar si el directorio existe o la ruta esta mal
    const [ error, directory ] = await to(validatePath(pathComplete));
    if(error)
        return next(error)

    req.params.path = directory
    next()
}

const validateCreateDir = [
    check('name', 'Name is missing').isString().not().isEmpty(),
    check('restype', 'Wrong retype. Options: directory - file').isIn(['directory', 'file']),
    validateFields
]

module.exports = {
    validatePathContent,
    validateCreateDir
}