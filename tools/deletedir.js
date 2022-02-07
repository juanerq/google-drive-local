const fs = require("fs");
const mz = require("mz/fs");

const convertPath = require("./convertpath");

const deleteDirectory = (pathDirectory) => {
    return new Promise( async (resolve, reject) => {
        const pathComplete = convertPath(pathDirectory);

        await mz.exists(pathComplete).then( (exists) => {
            if (!exists) 
                return resolve({message: 'The directory does not exist', path: pathComplete}); 
        })    

        fs.rm(pathComplete, { recursive: true }, (err) => {
            if(err) 
                return reject(`Something wrong happened removing ${pathComplete} folder`, err);
            
            return resolve(`Folder removed ${pathComplete}`);
        })        
    })
}

module.exports = deleteDirectory;