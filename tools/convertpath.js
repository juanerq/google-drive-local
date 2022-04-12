require('dotenv').config({path: './.env'});
const basepath = process.env.BASEPATH;
const path = require("path");


const convertPath = (pathSent) => {
    return pathComplete = pathSent 
        ? path.join(basepath, pathSent.replace('-','/')) 
        : basepath;
}

module.exports = convertPath;