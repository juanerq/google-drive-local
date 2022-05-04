const fs = require("fs");
const mz = require("mz/fs");

const deleteDirectory = (pathDirectory) => {
    return new Promise( async (resolve, reject) => {
        
        const exists = await mz.exists(pathDirectory)
        if (!exists) 
            return resolve({message: 'The directory does not exist', path: pathDirectory}); 

        fs.rm(pathDirectory, { recursive: true }, (err) => {
            if(err) 
                return reject(`Something wrong happened removing ${pathDirectory} folder`, err);
            
            return resolve(`Folder removed ${pathDirectory}`);
        })        
    })
}

module.exports = deleteDirectory;