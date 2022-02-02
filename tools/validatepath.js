const fs = require("fs");

// Validar si el directorio existe o la ruta esta mal
const validatePath = (pathDirectory) => {
    return new Promise((resolve, reject) => {
        // Si el directorio donde queremos guardar el archivo no existe
        if(!fs.existsSync(pathDirectory)) 
            return reject({error: 'The directory does not exist', path: pathDirectory});
        // Si se intenta guardar un archivo en la ruta de un fichero

        if(!fs.lstatSync(pathDirectory).isDirectory()) 
            return reject({error: 'Only directories are supported', path: pathDirectory});
        
        resolve(pathDirectory);
    })
}

module.exports = validatePath;