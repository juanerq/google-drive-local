const express = require("express");
const fileupload = require("express-fileupload");
const path = require('path');
const fs = require("fs");
const mz = require("mz/fs");

require('dotenv').config({path: './.env'})

const to = require("./tools/to");
const createDirectory = require("./tools/createdir");
const validatePath = require("./tools/validatepath");
const convertPath = require("./tools/convertpath");

const app = express();
app.use(fileupload());

const basepath = process.env.BASEPATH || __dirname;
const port = process.env.PORT || 3000;


const uploadFile = (file, storePath) => {
    const files = (!file.length) ? [file] : file;
    const existingFiles = [];
    const newFiles = [], nameNewFiles = [];

    return new Promise( async (resolve, reject) => {

        for(const file of files) {
            await mz.exists(`${storePath}/${file.name}`).then( exists => {
                if (exists) {
                    existingFiles.push(file.name);
                } else {
                    newFiles.push(file);
                    nameNewFiles.push(file.name);
                }
            })  
        }
        if (existingFiles.length == files.length) 
            return reject({message: 'The file already exists', existing: existingFiles}); 
        
        newFiles.forEach( f => {            
            f.mv(`${storePath}/${f.name}`, (err) => {
                if(err) return reject(err);
            })
        })
        resolve({ message: "Files received", uploaded: nameNewFiles, existing: existingFiles } );
    })
}

// Subir archivos
app.post('/:path?', async (req, res) => {
    let files = req.files;
    let pathSent = req.params.path;

    const pathComplete = convertPath(pathSent);
    // Validar si ha cargado un archivo
    if(!files || Object.keys(files).length == 0) {
        return res.status(400).send({ message: "No files uploaded" });
    }

    // Validar si existe un directorio donde guardar el archivo
    const [ error, directory ] = await to(validatePath(pathComplete));
    if(error) {
        return res.status(400).send(error)
    } 
 
    const [ erroruploadFile, result ] = await to(uploadFile(files.file, directory));
    if(erroruploadFile) 
        return res.status(500).send(erroruploadFile);

    res.status(200).send(result);
});


app.put('/:path/:name?', async (req, res) => {
    const { path: pathDirectory, name } = req.params;
    let restype = req.query.restype;

    if(restype == 'directory') {
        const [error, result] = await to(createDirectory(name, pathDirectory));
        if(error) 
            return res.status(400).send(error)
        return res.status(200).send(result)
    } else if(restype == 'file') {
        const [error, result] = await to(createFile(name, '¡¡Hola!!', pathDirectory));
        if(error) 
            return res.status(400).send(error)
        return res.status(200).send(result)
    }

    res.status(400).send({ message: `Wrong retype -> ${restype}` });

})

const contentFiles = (pathDirectory) => {
    let content = {};
    return new Promise((resolve, reject) => {
        fs.readdir(pathDirectory, (err, files) => {
            if(err) {
                reject(err)
            }
            files.forEach(file => {
                // Es un directorio o un fichero?
                if(fs.lstatSync(path.join(pathDirectory, file)).isDirectory()) {
                    let directory = fs.readdirSync(path.join(pathDirectory, file)); 
                    content[file] = directory || [];
                } else { 
                    content[file] = file;
                }
            })
            resolve(content);
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


const deleteDirectory = (pathDirectory) => {
    const pathComplete = path.join(basepath, pathDirectory);
    
    return new Promise( async (resolve, reject) => {
        await mz.exists(pathComplete).then( (exists) => {
            if (!exists) 
                return resolve({message: 'The directory does not exist', path: pathComplete}); 
        })    

        fs.rm(pathComplete, { recursive: true }, (err) => {
            if(err) 
                return reject(`Something wrong happened removing ${pathComplete} folder`, err)
            
            return resolve(`Folder removed ${pathComplete}`);
        })        
    })
}



app.get('/:path?', async (req, res) => {
    let pathSent = req.params.path;

    const pathComplete = convertPath(pathSent);
    
    // Validar si el directorio existe o la ruta esta mal
    const [ error, directory ] = await to(validatePath(pathComplete));
    if(error) {
        return res.status(400).send({ message: error })
    }
    // Mostrar contenido de los directorios
    const [ errorContent, content ] = await to(contentFiles(directory));
    if(errorContent) {
        return res.status(500).send(err);
    }
    res.status(200).send({ path: directory, content })
})


const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

module.exports = { 
    app, 
    server,
    deleteDirectory,
    createFile,
    basepath,
    validatePath
}
