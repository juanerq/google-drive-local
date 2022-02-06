const mz = require("mz/fs");

const searchFiles = (path, files) => {
    const exists = { files: [], names: [] };
    const newFiles = { files: [], names: [] };

    return new Promise( async (resolve, reject) => {
        for(const file of files) {
            await mz.exists(`${path}/${file.name}`).then( existFile => {
                if (existFile) {
                    exists['files'].push(file);
                    exists['names'].push(file.name);
                } else {
                    newFiles['files'].push(file);
                    newFiles['names'].push(file.name);
                }
            })  
        }
        if(exists['files'].length == files.length) {
            return reject({message: 'The file already exists', existing: exists.names})
        }
        resolve({ exists, newFiles })
    })
}

module.exports = searchFiles;