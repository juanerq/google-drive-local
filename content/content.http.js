const content = require("./content.controller");
const to = require("../tools/to");

const dirContent = async (req, res, next) => {
    const directory = req.params.path;

    // Mostrar contenido de los directorios
    const [ errorContent, dirContent ] = await to(content.dirContent(directory));
    if(errorContent) {
        return res.status(500).send(errorContent);
    }

    res.status(200).json({ path: directory, content: dirContent });
}


exports.dirContent = dirContent;
