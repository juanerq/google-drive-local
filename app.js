const express = require("express");
const fileupload = require("express-fileupload");
const path = require('path');
const fs = require("fs");

const app = express();

app.use(fileupload());
const port = '10101'

let to = require("./tools/to");
const { resolve } = require("path");

// Validar si la ruta nos lleva a un directorio
const validatePath = (pathDirectory) => {
    return new Promise((resolve, reject) => {
        let directory = (pathDirectory) ? pathDirectory.replace('-','/') : './';
        directory = path.resolve(directory);

        if(!fs.existsSync(directory)) 
            return reject({error: 'The directory does not exist', path: directory});

        if(!fs.lstatSync(directory).isDirectory()) 
            return reject({error: 'Only directories are supported', path: directory});
        
        resolve(directory);
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
                if(fs.lstatSync(path.resolve(pathDirectory, file)).isDirectory()) {
                    let directory = fs.readdirSync(path.resolve(pathDirectory, file)); 
                    content[file] = directory || [];
                } else { 
                    content[file] = file;
                }
            })
            resolve(content);
        })
    }) 
}


const createDirectory = (pathDirectory, name) => {
    // Validar si el directorio existe o la ruta esta mal
    return new Promise( async (result,  reject) => {

        const [ error, directory ] = await to(validatePath(pathDirectory));
        if(error) {
            return reject(error);
        }
        let pathComplete = path.join(directory, name)
    
        // Se crea el direcotrio
        // fs.mkdirSync(path.resolve(pathDirectory, name));
        fs.promises.mkdir(path.resolve(pathDirectory, name))
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


createDirectory('.', 'jjuan111')
    .then( res => console.log(res) )
    .catch( err => console.log(err) );


const deleteDirectory = (pathDirectory) => {
    fs.promises.rmdir(path.resolve(pathDirectory), { recursive: true })
    .then(() => {
        console.log(`${path.resolve(pathDirectory)} folder removed`);
    })
    .catch(err => {
        console.error(`Something wrong happened removing ${path.resolve(pathDirectory)} folder`, err)
    })
}





app.get('/:path?', async (req, res) => {
    let pathSent = req.params.path;
    // Validar si el directorio existe o la ruta esta mal
    const [ error, directory ] = await to(validatePath(pathSent));
    if(error) {
        return res.status(400).send({path: path.resolve(pathSent), message: error})
    }
    // Mostrar contenido de los directorios
    const [ errorContent, content ] = await to(contentFiles(directory));
    if(errorContent) {
        return res.status(500).send(err);
    }
    res.send({ path: directory, content })
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})