const create = require("./create.controller");
const to = require("../tools/to");

const createDir = async (req, res, next) => {
    const { path: pathDirectory } = req.params;
    const { restype, name, content } = req.body;

    if(restype == 'directory') {
        const [error, result] = await to(create.createDirectory(pathDirectory, name));
        if(error) return next(error)

        return res.status(200).json(result)
        
    } else if(restype == 'file') {
        const [error, result] = await to(create.createFile(pathDirectory, name, content));
        if(error) return next(error)

        return res.status(200).json(result)
    }

    res.status(400).json(
        { msg: `Wrong retype ${restype}. Options: directory - file` }
    );

}

exports.createDir = createDir;