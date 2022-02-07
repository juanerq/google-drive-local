const fs = require("fs");
const path = require("path");

const dirContent = (pathDirectory) => {
    return new Promise((resolve, reject) => {
        let content = {};
        
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

exports.dirContent = dirContent;
