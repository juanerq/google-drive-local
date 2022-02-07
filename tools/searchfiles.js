const mz = require("mz/fs");

const searchFiles = async (path, files) => {
    const exists = { files: [], names: [] };
    const newFiles = { files: [], names: [] };

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
        throw({message: 'The file already exists', existing: exists.names})
    }
    return({ exists, newFiles })
}

module.exports = searchFiles;