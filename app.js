const express = require("express");
const app = express();
const cors = require("cors")
const fileupload = require("express-fileupload");

app.use(express.json(),
        fileupload(),
        cors());

require('dotenv').config({path: './.env'});
const port = process.env.PORT || 10101;

const upload = require("./upload/upload.router").router;
const create = require("./create/create.router").router;
const content = require("./content/content.router").router;
const watch = require("./watchvideo/watch.router").router;

app.use('/watch', watch);

app.use('/', upload);
app.use('/', create);
app.use('/', content);

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
})

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

module.exports = { app, server }
