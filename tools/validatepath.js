const fs = require("fs");
const to = require("../tools/to");

// Validar si el directorio existe o la ruta esta mal
const validatePath = async (pathDirectory) => {
    return Promise.allSettled([
        to(fs.promises.access(pathDirectory)),
        fs.promises.lstat(pathDirectory)
    ])
    .then( result => {
        const [{ value: notExist }, { value: file }] = result;
        
        // Si el directorio donde queremos guardar el archivo no existe
        if(notExist[0])
            throw({error: 'The directory does not exist', path: pathDirectory});
    
        // Si se intenta guardar un archivo en la ruta de un fichero
        if(!file.isDirectory())
            throw({error: 'Only directories are supported', path: pathDirectory});
    
        return(pathDirectory);
    })
}

// const validatePath = async (pathDirectory) => {
//     // Si el directorio donde queremos guardar el archivo no existe
//     const [ notExist ] = await to(fs.promises.access(pathDirectory));
//     if(notExist)
//         throw({error: 'The directory does not exist', path: pathDirectory});

//     // Si se intenta guardar un archivo en la ruta de un fichero
//     const file = await fs.promises.lstat(pathDirectory);
//     if(!file.isDirectory())
//         throw({error: 'Only directories are supported', path: pathDirectory});

//     return(pathDirectory);
// }

module.exports = validatePath;