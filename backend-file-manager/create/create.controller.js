const path = require('path')
const fs = require("fs")
const mz = require("mz/fs")

const createDirectory = (pathDirectory, name) => {
    const pathComplete = path.join(pathDirectory, name)

    return new Promise((result,  reject) => {
        // Se crea el direcotrio
        fs.promises.mkdir(pathComplete)
            .then( async () => {
                //Se comprueba si ha sido creado
                // const exists = await mz.exists(pathComplete)
                // if (!exists) 
                //     return reject({msg: 'Directory not created', path: pathComplete}) 

                result({ message: 'Directory created successfully', path: pathComplete })

            }).catch(err => {
                if(err.code == 'EEXIST') {
                    reject({msg: 'The directory already exists', path: pathComplete}) 
                }
            })
    })
}

const createFile = (pathFile, nameFile, contentFile = '') => {
    const pathComplete = path.join(pathFile, nameFile)
    
    return new Promise( async (resolve, reject) => {
        const exists = await mz.exists(pathComplete)
        if (exists) 
            return reject({msg: 'The file already exists', path: pathComplete}) 

        fs.writeFile(pathComplete, contentFile, (error) => {
            if (error) 
                return reject({msg: error, path: pathComplete}) 
            resolve({msg: 'File created successfully', path: pathComplete})
        }) 
    })
}

module.exports = {
    createDirectory,
    createFile
}