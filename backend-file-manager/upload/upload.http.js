const to = require("../tools/to")
const upload = require("./upload.controller")

const uploadFiles = async (req, res, next) => {
  const files = req.files?.files
  const path = req.params.path

  // Validar si ha cargado un archivo
  if(!files)
    return next({ msg: 'No files uploaded' })

  const [ uploadError, result ] = await to(upload(files, path))
  if(uploadError) 
    return next(uploadError)

  res.status(200).json(result)
}

module.exports = uploadFiles