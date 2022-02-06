const to = require("../tools/to");
const validatePath = require("../tools/validatepath");
const convertPath = require("../tools/convertpath");
const dir = require("./upload.controller");


const uploadFiles = async (req, res) => {
    let files = req.files;
    let pathSent = req.params.path;

    const pathComplete = convertPath(pathSent);
    // Validar si ha cargado un archivo
    if(!files || Object.keys(files).length == 0) {
        return res.status(400).send({ message: "No files uploaded" });
    }

    // Validar si existe un directorio donde guardar el archivo
    const [ error, directory ] = await to(validatePath(pathComplete));
    if(error) {
        return res.status(400).send(error)
    } 
 
    const [ errorUploadFile, result ] = await to(dir.upload(files.file, directory));
    if(errorUploadFile) 
        return res.status(400).send(errorUploadFile);

    res.status(200).send(result);
}

exports.uploadFiles = uploadFiles;