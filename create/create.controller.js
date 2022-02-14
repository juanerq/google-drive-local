const path = require('path');
const fs = require("fs");
const mz = require("mz/fs");

const to = require("../tools/to");
const validatePath = require("../tools/validatepath");
const convertPath = require("../tools/convertpath");

const createDirectory = (name, pathDirectory) => {
    let pathComplete = convertPath(pathDirectory);

    return new Promise( async (result,  reject) => {
        const [ error, directory ] = await to(validatePath(pathComplete));
        if(error) {
            return reject(error);
        }
        pathComplete = path.join(directory, name)
        // Se crea el direcotrio
        fs.promises.mkdir(pathComplete)
        .then( async () => {
            //Se comprueba si ha sido creado
            // let existDir = fs.existsSync(pathComplete);
            await mz.exists(pathComplete).then((exists) => {
                if (!exists) 
                reject({error: '¡Not found!', message: `Checking for director ${pathComplete}`}); 
            })    
      
            result({ message: 'Directory created successfully', path: pathComplete });
        })
        .catch(err => {
            if(err.code == 'EEXIST') {
                reject({error: 'The directory already exists', path: pathComplete}); 
            }
        })
    })
}

const createFile = (nameFile, contentFile, pathFile) => {
    const pathComplete = convertPath(pathFile);
    
    return new Promise( async (resolve, reject) => {
        const [ error, directory ] = await to(validatePath(pathComplete));
        if (error) {
            return reject(error);
        }
        const pathName = path.join(directory, nameFile);

        await mz.exists(pathName).then((exists) => {
            if (exists) 
                return reject({message: 'The file already exists', path: pathName}); 
        })    

        fs.writeFile(pathName, contentFile || '', (err) => {
            if (err) 
                return reject({message: error, path: pathComplete}); 
            resolve({message: 'File created successfully', path: pathName})
        }); 
    })
}

exports.createDirectory = createDirectory;
exports.createFile = createFile;