const convertPath = require("../tools/convertpath");
const validatePath = require("../tools/validatepath");
const content = require("./content.controller");
const to = require("../tools/to");

const dirContent = async (req, res) => {
    let pathSent = req.params.path;

    const pathComplete = convertPath(pathSent);
    
    // Validar si el directorio existe o la ruta esta mal
    const [ error, directory ] = await to(validatePath(pathComplete));
    if(error) {
        return res.status(400).send({ message: error })
    }
    // Mostrar contenido de los directorios
    const [ errorContent, dirContent ] = await to(content.dirContent(directory));
    if(errorContent) {
        return res.status(500).send(err);
    }
    res.status(200).send({ path: directory, content: dirContent })
}

exports.dirContent = dirContent;