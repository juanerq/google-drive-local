const express = require("express");
const fileupload = require("express-fileupload");

const app = express();
app.use(fileupload());

require('dotenv').config({path: './.env'});
const port = process.env.PORT || 3000;

const upload = require("./upload/upload.router").router;
const create = require("./create/create.router").router;
const content = require("./content/content.router").router;

app.use('/', upload);
app.use('/', create);
app.use('/', content);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

module.exports = { app, server }
