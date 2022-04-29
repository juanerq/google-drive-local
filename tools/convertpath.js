const basepath = process.env.BASEPATH;
const path = require("path");

const convertPath = (pathSent) => {
    return pathComplete = pathSent 
        ? path.join(basepath, pathSent.replace(/-/g,'/')) 
        : basepath
}

module.exports = convertPath