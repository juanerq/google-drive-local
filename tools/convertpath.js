require('dotenv').config({path: './.env'});
const basepath = process.env.BASEPATH || __dirname;
const path = require("path");


const convertPath = (pathSent) => {
    return pathComplete = (pathSent == basepath) ? 
    basepath : (pathSent) ? 
    path.join(basepath, pathSent.replace('-','/')) : basepath;
}

module.exports = convertPath;