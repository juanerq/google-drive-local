const validatePath = require('../tools/validatepath')
const convertPath = require('../tools/convertpath')
const to = require('../tools/to')

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

module.exports = validatePathContent
