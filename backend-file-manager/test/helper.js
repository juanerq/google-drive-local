const fs = require('fs')

const { app } = require("../app");
const supertest = require("supertest");
const api = supertest(app);

const { createDirectory, createFile } = require("../create/create.controller")

// const pathProject = __dirname
//     .split('/')
//     .slice(0, -1)
//     .join('/')

const dirTestContent = () => {
    return fs.readdirSync(__dirname)
}

const createDirectorys = async (path, directories) => {
    const createDirectorys = directories.map(dirName => createDirectory(path, dirName))
    await Promise.all(createDirectorys)
}

const createFiles = async (path, files) => {
    const createFiles = files.map(fileName => createFile(path, fileName))
    await Promise.all(createFiles)
}


module.exports = {
    dirTestContent,
    createDirectorys,
    createFiles,
    api
}