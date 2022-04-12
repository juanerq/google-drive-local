const fs = require("fs");
const path = require("path");

const dirContent = (pathDirectory) => {
    return new Promise((resolve, reject) => {
        let content = {};
        
        fs.readdir(pathDirectory, (err, files) => {
            if(err) return reject(err)

            files.forEach(file => {
                // Es un directorio o un fichero?
                const pathFile = path.join(pathDirectory, file)

                if(fs.lstatSync(pathFile).isDirectory()) {
                    let directory = fs.readdirSync(pathFile); 
                    content[file] = directory || [];
                } else { 
                    const splitFile = file.split(".")
                    const type = splitFile[ splitFile.length - 1 ];
                    content[file] = { type, file };
                }
            })
            resolve(content);
        })
    }) 
}

exports.dirContent = dirContent;
