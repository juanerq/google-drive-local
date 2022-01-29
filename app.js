const express = require("express");
const fileupload = require("express-fileupload");
const path = require('path');
const fs = require("fs");

const app = express();

app.use(fileupload());
const port = '10101'

let to = require("./tools/to");

const basepath = path.resolve();

// Validar si la ruta nos lleva a un directorio
const validatePath = (pathDirectory) => {
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(pathDirectory)) 
            return reject({error: 'The directory does not exist', path: pathDirectory});

        if(!fs.lstatSync(pathDirectory).isDirectory()) 
            return reject({error: 'Only directories are supported', path: pathDirectory});
        
        resolve(pathDirectory);
    })
}

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
        return res.status(400).send({path: path.resolve(pathSent), message: error})
    }
   
    const [ errorMoveFile, result ] = await to(moveFile(imageFile.file, path.resolve(directory)));
    if(errorMoveFile) return res.status(500).send(errorMoveFile);
    res.send({ message: "Files received" });
        
});

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



const createDirectory = (name, pathDirectory) => {
    let pathComplete = (pathDirectory) ? 
        path.join(basepath, pathDirectory.replace('-','/')) : basepath;
    // Validar si el directorio existe o la ruta esta mal
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


// createDirectory('.', 'jjuan111')
//     .then( res => console.log(res) )
//     .catch( err => console.log(err) );

const createFile = (nameFile, contentFile, pathFile) => {

    const pathName = path.join(basepath, pathFile || '', nameFile);

    
    fs.writeFile(pathName, contentFile || '', (err) => {
        if (err) throw err;
      }); 
}

const deleteDirectory = (pathDirectory) => {
    if(!fs.existsSync(path.join(basepath, pathDirectory)))
        return 'The directory does not exist';
    
    return new Promise((resolve, reject) => {
        fs.rm(path.join(basepath, pathDirectory), { recursive: true }, (err) => {
            if(err) {
                return reject(`Something wrong happened removing ${path.join(basepath, pathDirectory)} folder`, err)
            }
            return resolve(`Folder removed ${path.join(basepath, pathDirectory)}`);
        })        
    })
}



app.get('/:path?', async (req, res) => {
    let pathSent = req.params.path;

    let pathComplete = (pathSent) ? 
        path.join(basepath, pathSent.replace('-','/')) : basepath;
    
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
    createDirectory,
    deleteDirectory,
    createFile
}
