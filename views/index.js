const { dialog } = require('electron').remote;
const fs = require('fs');
const os = require('os');
const path = require('path');
const express = require('express');
// const sharp = require('sharp');

var tmpPath = os.tmpdir() + path.sep + 'LightSpread-thumbs';
var selectedPath = null;
var selectedFiles = new Array();
var selectedFilesIndex = new Array();
var allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
];
var server;

var selectFolder = (selectedPath) => {
    document.querySelector('#path-selected').innerHTML = selectedPath;
    document.querySelectorAll('.path-selected-indicator').forEach((el) => {
        el.classList.remove('fa-circle');
        el.classList.add('fa-check-circle');
        el.classList.add('text-success');
    });
};

var unselectFolder = (msg) => {
    document.querySelector('#path-selected').innerHTML = "<i>"+msg+"</i>";
    document.querySelectorAll('.path-selected-indicator').forEach((el) => {
        el.classList.remove('text-success');
        el.classList.remove('fa-check-circle');
        el.classList.add('fa-circle');
    });
};

var unmuteServerSwitch = () => {
    document.querySelector('.server-run-indicator').parentElement.classList.remove('text-muted');
    document.querySelector('#server-switch').disabled = false;
};

var muteServerSwitch = () => {
    document.querySelector('.server-run-indicator').parentElement.classList.add('text-muted');
    document.querySelector('#server-switch').disabled = true;
};

var unmuteFolderSelector = () => {
    document.querySelector('#folder-selector').disabled = false;
};

var muteFolderSelector = () => {
    document.querySelector('#folder-selector').disabled = true;
};

var startServer = () => {
    var app = express();

    app.get(['/', '/index.html'], function (req, res) {
        res.sendFile(path.resolve(__dirname, './gallery.html'));
    });

    app.get(['/dist/gallery.css'], function (req, res) {
        res.sendFile(path.resolve(__dirname, './dist/gallery.css'));
    });

    app.get(['/dist/gallery.js'], function (req, res) {
        res.sendFile(path.resolve(__dirname, './dist/gallery.js'));
    });

    // JSON Response with image list
    app.get(['/images'], function (req, res) {
        res.append('Content-Type', 'application/json');
        res.send(JSON.stringify({data: selectedFiles}));
    });

    app.get(['/images/:name'], function (req, res) {
        var name = req.params.name;

        if (! selectedFilesIndex.includes(name)) {
            res.sendStatus(404);
            return;
        }

        res.download(selectedPath + name);
    });

    server = app.listen(3000);

    console.log('Server gestartet');
};

var stopServer = () => {
    if (server) {
        server.close();
        server = null;
    }

    console.log('Server gestoppt');
};

var handleSelectedFolder = (filePaths) => {
    if (! filePaths) {
        selectedPath = null;
        selectedFiles = new Array();
        selectedFilesIndex = new Array();
        unselectFolder('Kein Ordner gewählt');
        document.querySelector('#image-founded').innerHTML = '';
        muteServerSwitch();
        return;
    }

    selectedPath = filePaths[0] + path.sep;

    fs.readdir(selectedPath, (err, files) => {
        if (err) {
            selectedFiles = new Array();
            selectedFilesIndex = new Array();
            unselectFolder('Fehler: Auf Ordner "'+selectedPath+'" kann nicht zugegriffen werden');
            document.querySelector('#image-founded').innerHTML = '';
            selectedPath = null;
            muteServerSwitch();
            return;
        }

        selectFolder(selectedPath);

        // Reset temp folder
        try {
            fs.rmdirSync(tmpPath);
        } catch (err) {
            console.log('tmp folder konnte nicht gelöscht werden: ' + err);
        }
        fs.mkdirSync(tmpPath);

        files.forEach((value, index) => {
            // Ignore files/folders with wrong extensions
            var ext = path.extname(value).toLowerCase();
            if (! allowedExtensions.includes(ext)) {
                return;
            }

            // ignore folders and symlinks
            var stat = fs.statSync(selectedPath + value);
            if (! stat.isFile()) {
                return;
            }

            // createThumbnailFromImage(selectedPath + value, value);

            selectedFiles.push({name: value, size: stat.size});
            selectedFilesIndex.push(value);
        });

        document.querySelector('#image-founded').innerHTML = '<i>'+selectedFilesIndex.length+' Bilder gefunden</i>';
        unmuteServerSwitch();
    });
};

var createThumbnailFromImage = (imagePath, name) => {
    console.log(imagePath);
    console.log(tmpPath);

    sharp(imagePath)
        .resize(300, 300)
        .toFile(tmpPath + name, (err, info) => {
            if (err) {
                console.error(err);
                return;
            }

            console.log(info);
        });
}

document.querySelector('#folder-selector').addEventListener('click', (e) => {
    dialog.showOpenDialog(
        {
            properties: ['openDirectory']
        },
        handleSelectedFolder
    );
});

document.querySelector('#server-switch').addEventListener('click', (e) => {
    if (server) {
        stopServer();
        unmuteFolderSelector();
        e.target.innerHTML = 'Start';
        document.querySelector('#server-status').innerHTML = '<i>Server beendet</i>';
        document.querySelectorAll('.server-run-indicator').forEach((el) => {
            el.classList.remove('text-success');
            el.classList.remove('fa-check-circle');
            el.classList.add('fa-circle');
        });
    } else {
        muteFolderSelector();
        startServer();
        e.target.innerHTML = 'Stop';
        document.querySelector('#server-status').innerHTML = '<i>Server gestartet unter http://localhost:3000</i>';
        document.querySelectorAll('.server-run-indicator').forEach((el) => {
            el.classList.remove('fa-circle');
            el.classList.add('fa-check-circle');
            el.classList.add('text-success');
        });
    }
});
