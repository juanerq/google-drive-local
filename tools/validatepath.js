const fs = require("fs");

// Validar si el directorio existe o la ruta esta mal
const validatePath = (pathDirectory) => {

    return new Promise((resolve, reject) => {
        if(!fs.existsSync(pathDirectory)) 
            return reject({error: 'The directory does not exist', path: pathDirectory});

        if(!fs.lstatSync(pathDirectory).isDirectory()) 
            return reject({error: 'Only directories are supported', path: pathDirectory});
        
        resolve(pathDirectory);
    })
}

module.exports = validatePath;