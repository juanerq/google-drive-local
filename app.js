const express = require("express");
const fileupload = require("express-fileupload");
const path = require('path');
const fs = require("fs");
require('dotenv').config({path: './.env'})

const to = require("./tools/to");
const createDirectory = require("./tools/createdir");
const validatePath = require("./tools/validatepath");
const convertPath = require("./tools/convertpath");

const app = express();
app.use(fileupload());

const basepath = process.env.BASEPATH || __dirname;
const port = process.env.PORT || 3000;


const moveFile = (file, storePath) => {
    const files = (!file.length) ? [file] : file;

    return new Promise((resolve, reject) => {
        files.forEach( f => {
            f.mv(`${storePath}/${f.name}`, (err) => {
                if(err) return reject(err);
            })
        })
        resolve(file.name);
    })
}

// Subir archivos
app.post('/:path?', async (req, res) => {
    let imageFile = req.files;
    let pathSent = req.params.path;

    // Validar si ha cargado un archivo
    if(!imageFile || Object.keys(imageFile).length == 0) {
        return res.status(400).send({ message: "No files uploaded" });
    }

    // Validar si existe un directorio donde guardar el archivo
    const [ error, directory ] = await to(validatePath(pathSent));
    if(error) {
        return res.status(400).send(error)
    }
   
    const [ errorMoveFile, result ] = await to(moveFile(imageFile.file, path.resolve(directory)));
    if(errorMoveFile) return res.status(500).send(errorMoveFile);
    res.send({ message: "Files received" });
        
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
        if(error) {
            return reject(error);
        }
        const pathName = path.join(directory, nameFile);

        if(fs.existsSync(pathName))
            return reject({message: 'The file already exists', path: pathName}); 

        fs.writeFile(pathName, contentFile || '', (err) => {
            if (err) 
                return reject({message: error, path: pathComplete}); 
            resolve({message: 'File created successfully', path: pathName})
        }); 
    })
}


const deleteDirectory = (pathDirectory) => {
    if(!fs.existsSync(path.join(basepath, pathDirectory)))
        return 'The directory does not exist';
    
    return new Promise((resolve, reject) => {
        fs.rm(path.join(basepath, pathDirectory), { recursive: true }, (err) => {
            if(err) 
                return reject(`Something wrong happened removing ${path.join(basepath, pathDirectory)} folder`, err)
            
            return resolve(`Folder removed ${path.join(basepath, pathDirectory)}`);
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
