const create = require("./create.controller");
const to = require("../tools/to");

const createDir = async (req, res) => {
    const { path: pathDirectory, name } = req.params;
    let restype = req.query.restype;

    if(restype == 'directory') {
        const [error, result] = await to(create.createDirectory(name, pathDirectory));
        if(error) 
            return res.status(400).send(error)
        return res.status(200).send(result)
    } else if(restype == 'file') {
        const [error, result] = await to(create.createFile(name, '¡¡Hola!!', pathDirectory));
        if(error) 
            return res.status(400).send(error)
        return res.status(200).send(result)
    }

    res.status(400).send({ message: `Wrong retype -> ${restype}` });

}

exports.createDir = createDir;