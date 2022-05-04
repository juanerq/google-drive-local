import postDirs from '../helpers/postDirs'

export const newDirectoryOrFile = (path, name, type = 'dir') => {
  return new Promise((resolve, reject) => {
    const data = type === 'dir' 
      ? { restype: 'directory', name}
      : { restype: 'file', name}
  
    postDirs(path, data)
      .then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
  })
}