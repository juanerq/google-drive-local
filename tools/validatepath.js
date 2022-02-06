const fs = require("fs");
const to = require("../tools/to");

// Validar si el directorio existe o la ruta esta mal
const validatePath = (pathDirectory) => {
    return new Promise( async (resolve, reject) => {
        // Si el directorio donde queremos guardar el archivo no existe
        const [ notExist ] = await to(fs.promises.access(pathDirectory));
        if(notExist)
            return reject({error: 'The directory does not exist', path: pathDirectory});

        // Si se intenta guardar un archivo en la ruta de un fichero
        const file = await fs.promises.lstat(pathDirectory);
        if(!file.isDirectory())
            return reject({error: 'Only directories are supported', path: pathDirectory});

        resolve(pathDirectory);
    })
}

module.exports = validatePath;