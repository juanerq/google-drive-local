const to = require("./to");
const path = require('path');
const fs = require("fs");

const validatePath = require("./validatepath");
const convertPort = require("./convertport");

const createDirectory = (name, pathDirectory) => {

    let pathComplete = convertPort(pathDirectory);

    return new Promise( async (result,  reject) => {
        const [ error, directory ] = await to(validatePath(pathComplete));
        if(error) {
            return reject(error);
        }
        pathComplete = path.join(directory, name)
        // Se crea el direcotrio
        // fs.mkdirSync(path.resolve(pathDirectory, name));
        fs.promises.mkdir(pathComplete)
            .then(() => {
                //Se comprueba si ha sido creado
                let existDir = fs.existsSync(pathComplete);
                if(!existDir) { 
                    reject({error: '¡Not found!', message: `Checking for director ${pathComplete}`}); 
                }
                result({ message: 'Directory created successfully', path: pathComplete });
            })
            .catch(err => {
                if(err.code == 'EEXIST') {
                    reject({error: 'The directory already exists', path: pathComplete}); 
                }
            })
    })
}

module.exports = createDirectory;