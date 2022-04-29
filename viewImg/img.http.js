const fs = require('fs')
const isImage = require('is-image')
const convertPath = require('../tools/convertpath')

const viewImg = (req, res, next) =>{ 

    const { path } = req.params
    const imgPath = convertPath(path)

    if(!isImage(imgPath))
      return next({
        msg: "It's not an image",
        path: imgPath
      })

    fs.readFile(imgPath, (error, data) => {
      if(error)
        return next({
          msg: 'Image not found',
          path: imgPath
        })
      
      res.writeHead(200, {'Content-Type': 'image/jpeg'})
      res.end(data)
    });

}

module.exports = viewImg