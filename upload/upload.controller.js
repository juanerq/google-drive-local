const searchFiles = require("../tools/searchfiles");
const to = require("../tools/to");

const upload = async (file, storePath) => {
    const listFiles = (!file.length) ? [file] : file;
    // Busca si hay archivos con ese mismo nombre
    const [ error, files ] = await to(searchFiles(storePath, listFiles));
    if (error) 
        throw error; 

    files.newFiles.files.forEach( f => {            
        f.mv(`${storePath}/${f.name}`, (err) => {
            if(err) throw err;
        })
    })
    return({ 
        message: "Files received", 
        uploaded: files.newFiles.names, 
        existing: files.exists.names 
    });
}

exports.upload = upload;