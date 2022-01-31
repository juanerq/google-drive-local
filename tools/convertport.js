require('dotenv').config({path: '../.env'});
const path = require("path");
const basepath = process.env.BASEPATH || __dirname;

const convertPort = (pathSent) => {
    return pathComplete = (pathSent == basepath) ? 
    basepath : (pathSent) ? 
    path.join(basepath, pathSent.replace('-','/')) : basepath;
}

module.exports = convertPort;