require('dotenv').config({path: './.env'});

process.env.BASEPATH = process.env.NODE_ENV == 'test'
    ? `${__dirname}/test`
    : __dirname

const express = require("express");
const app = express();
const cors = require("cors")
const fileupload = require("express-fileupload");

const handleErrors = require('./middlewares/handleErrors')

app.use(express.json(),
        fileupload(),
        cors());

const port = process.env.PORT;

const upload = require("./upload/upload.router").router;
const create = require("./create/create.router").router;
const content = require("./content/content.router");
const watch = require("./watchvideo/watch.router").router;

app.use('/watch', watch);

app.use('/', upload);
app.use('/', create);
app.use('/', content);

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
})

app.use(handleErrors)

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

module.exports = { app, server }