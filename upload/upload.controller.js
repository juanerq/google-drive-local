const searchFiles = require("../tools/searchfiles");
const to = require("../tools/to");

const upload = (file, storePath) => {
    const listFiles = (!file.length) ? [file] : file;

    return new Promise( async (resolve, reject) => {
        

        const [ error, files ] = await to(searchFiles(storePath, listFiles));
        if (error) 
            return reject(error); 
        files.newFiles.files.forEach( f => {            
            f.mv(`${storePath}/${f.name}`, (err) => {
                if(err) return reject(err);
            })
        })
        resolve({ 
            message: "Files received", 
            uploaded: files.newFiles.names, 
            existing: files.exists.names 
        });
    })
}

exports.upload = upload;