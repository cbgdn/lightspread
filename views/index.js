const { dialog } = require('electron').remote;
const path = require('path');
const express = require('express');

var selectedPath = null;
var server;

var selectFolder = (selectedPath) => {
    document.querySelector('#path-selected').innerHTML = selectedPath;
    document.querySelectorAll('.path-selected-indicator').forEach((el) => {
        el.classList.remove('fa-circle');
        el.classList.add('fa-check-circle');
        el.classList.add('text-success');
    });
};

var unselectFolder = () => {
    document.querySelector('#path-selected').innerHTML = "<i>Kein Ordner gewählt</i>";
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
    if (filePaths) {
        selectedPath = filePaths[0];
        selectFolder(selectedPath);
        unmuteServerSwitch();
    } else {
        selectedPath = null;
        unselectFolder();
        muteServerSwitch();
    }
};

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
