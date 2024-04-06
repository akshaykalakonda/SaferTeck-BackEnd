const http = require('http');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date()}] ${req.method} ${req.url}`);
    next();
});

// Endpoint for creating file
app.post('/createFile', (req, res) => {
    const { filename, content } = req.body;
    fs.writeFile(filename, content, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing file');
        }
        console.log(`File ${filename} created`);
        res.status(200).send('File created successfully');
    });
});

// Endpoint for getting list of files
app.get('/getFile   s', (req, res) => {
    fs.readdir('.', (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading directory');
        }
        res.json(files);
    });
});

// Endpoint for getting file by filename
app.get('/getFile/:filename', (req, res) => {
    const filename = req.params.filename;
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).send('File not found');
        }
        res.send(data);
    });
});

// Start the server
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('To create a file, send a POST request to /createFile with filename and content in the body.');
    console.log('To get the list of uploaded files, send a GET request to /getFiles.');
    console.log('To get the content of a file, send a GET request to /getFile/<filename>.');
});
