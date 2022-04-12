const fs = require('fs')

const pathPorject = __dirname
    .split('/')
    .slice(0, -1)
    .join('/')

const projectContent = () => {
    return fs.readdirSync(pathPorject)
}

module.exports = {
    projectContent
}