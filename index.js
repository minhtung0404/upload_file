var http = require('http');
var fs = require('fs');
var express = require('express');
var formidable = require('formidable');
var path = require('path');
var app = express();

app.use(express.static('public'));

let Data, Upload, Download;

fs.readFile('./public/html/index.html', 'utf8', (err, data) => {
    if (err) throw err;
    Data = data;
});

fs.readFile('./public/html/download.html', 'utf8', (err, data) => {
    if (err) throw err;
    Download = data;
});

fs.readFile('./public/html/upload.html', 'utf8', (err, data) => {
    if (err) throw err;
    Upload = data;
});

app.get('/', function(req, res){
    res.write(Data);
    res.end();
});

app.get('/download', function(req, res){
    fs.readdir('./public/files/', (err, files) =>{
        if (err) throw err;
        if (files.length > 0){
            let html = '<a class = "link">Here is all the files: </a><br>\n';
            files.forEach(file => {
                console.log(file);
                html += '<br><a class = "link" href="./files/' + file + '" download>' + file + '</a>\n';
            });
            html = Download.replace("[file]", html);
            res.write(html);
        }
        else{
            let html = '<a class = "link">Cannot find a file</a><br>';
            html = Download.replace("[file]", html);
            res.write(html);
        }
        res.end();
    });
});

app.get('/files/:filename', function(req, res){
    res.download('./public/files/' + req.params.filename, (err) => {
        if (err) throw err;
        console.log("Download " + req.params.filename + " completed!");
        res.end();
    });
});

app.get('/upload', function(req, res){
    res.write(Upload);
    res.end();
});

app.post('/upload', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        var oldpath = files.upload.path;
        var newpath = './public/files/' + files.upload.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.redirect('/');
        });
        console.log('File ' + files.upload.name + ' is uploaded');
    });
})

app.listen(8080, function(req, res){
    console.log("Listen on port 8080");
});
