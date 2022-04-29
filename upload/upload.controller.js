const searchFiles = require("../tools/searchfiles")
const to = require("../tools/to")

const upload = async (file, storePath) => {
  const listFiles = (!file.length) ? [file] : file
  
  // Busca si hay archivos con ese mismo nombre
  const [ error, files ] = await to(searchFiles(storePath, listFiles))
  if (error) 
    throw error 

  const { exists, newFiles } = files

  newFiles.files.forEach( f => {            
    f.mv(`${storePath}/${f.name}`, (error) => {
        if(error) throw error
    })
  })
  return({ 
    msg: "Files received", 
    uploaded: newFiles.names, 
    existing: exists.names 
  })
}

module.exports = upload