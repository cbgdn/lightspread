const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const express = require('express');
const packageData = require('../package.json');
const ImageStore = require('../src/imagestore');
const store = new ImageStore();

var selectedPath = null;
var allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
];
var server;

var selectFolder = (selectedPath) => {
    document.querySelector('#folder-selector').classList.add('btn-secondary');
    document.querySelector('#folder-selector').classList.remove('btn-primary');
    document.querySelector('#path-selected').innerHTML = selectedPath;
    document.querySelectorAll('.path-selected-indicator').forEach((el) => {
        el.classList.remove('fa-circle');
        el.classList.add('fa-check-circle');
        el.classList.add('text-success');
    });
};

var unselectFolder = (msg) => {
    document.querySelector('#folder-selector').classList.add('btn-primary');
    document.querySelector('#folder-selector').classList.remove('btn-secondary');
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
    document.querySelector('#server-switch').classList.add('btn-primary');
    document.querySelector('#server-switch').classList.remove('btn-secondary');
};

var muteServerSwitch = () => {
    document.querySelector('.server-run-indicator').parentElement.classList.add('text-muted');
    document.querySelector('#server-switch').disabled = true;
    document.querySelector('#server-switch').classList.add('btn-secondary');
    document.querySelector('#server-switch').classList.remove('btn-primary');
};

var unmuteFolderSelector = () => {
    document.querySelector('#folder-selector').disabled = false;
};

var muteFolderSelector = () => {
    document.querySelector('#folder-selector').disabled = true;
};

var unmuteBrowserButton = () => {
    document.querySelector('.browser-start-indicator').parentElement.classList.remove('text-muted');
    document.querySelector('#browser-start').disabled = false;
    document.querySelector('#browser-start').classList.add('btn-primary');
    document.querySelector('#browser-start').classList.remove('btn-secondary');
};

var muteBrowserButton = () => {
    document.querySelector('.browser-start-indicator').parentElement.classList.add('text-muted');
    document.querySelector('#browser-start').disabled = true;
    document.querySelector('#browser-start').classList.add('btn-secondary');
    document.querySelector('#browser-start').classList.remove('btn-primary');
};

var startServer = () => {
    var app = express();

    app.get(['/', '/index.html'], function (req, res) {
        res.sendFile(path.resolve(__dirname, './gallery.html'));
    });

    app.get(['/dist/:name'], function (req, res) {
        var name = req.params.name;

        fs.access(path.resolve(__dirname, './dist/' + name), fs.constants.F_OK, (err) => {
            if (err) {
                console.log(path.resolve(__dirname, './dist/' + name) + ' nicht gefunden');
                res.sendStatus(404);
                return;
            }

            res.sendFile(path.resolve(__dirname, './dist/'+name));
        });
    });

    // JSON Response with image list
    app.get(['/images'], function (req, res) {
        store.getAllData()
        .then((files) => {
            let data = new Array();

            for (let value of files) {
                data.push({
                    name: value.name,
                    path: 'images/' + value.name,
                    thumbnail: 'thumbs/' + value.name,
                    size: value.size,
                });
            }

            res.append('Content-Type', 'application/json');
            res.send(JSON.stringify({data: data}));
        });
    });

    app.get(['/images/:name'], function (req, res) {
        var name = req.params.name;

        store.getData(name)
        .catch(() => {
            res.sendStatus(404);
        })
        .then((data) => {
            res.download(data.file);
        });
    });

    app.get(['/thumbs/:name'], function (req, res) {
        var name = req.params.name;

        store.getData(name)
        .catch(() => {
            res.sendStatus(404);
        })
        .then((data) => {
            res.download(data.thumbFile);
        });
    });

    server = app.listen(3000);

    document.querySelector('#server-switch').classList.add('btn-secondary');
    document.querySelector('#server-switch').classList.remove('btn-primary');
    console.log('Server gestartet');
};

var stopServer = () => {
    if (server) {
        server.close();
        server = null;
    }

    document.querySelector('#server-switch').classList.add('btn-primary');
    document.querySelector('#server-switch').classList.remove('btn-secondary');
    console.log('Server gestoppt');
};

var handleSelectedFolder = (filePaths) => {
    if (! filePaths) {
        selectedPath = null;
        store.reset();
        unselectFolder('Kein Ordner gewählt');
        document.querySelector('#image-founded').innerHTML = '';
        muteServerSwitch();
        return;
    }

    selectedPath = filePaths[0] + path.sep;

    fs.readdir(selectedPath, (err, files) => {
        if (err) {
            store.reset();
            unselectFolder('Fehler: Auf Ordner "'+selectedPath+'" kann nicht zugegriffen werden');
            document.querySelector('#image-founded').innerHTML = '';
            selectedPath = null;
            muteServerSwitch();
            return;
        }

        // Reset store
        store.reset();

        let imageOperations = new Array();

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

            imageOperations.push(
                store.add(value, selectedPath + value, stat.size)
            );
        });

        Promise.all(imageOperations)
            .then(() => {
                selectFolder(selectedPath);
                document.querySelector('#image-founded').innerHTML = '<i>'+store.count()+' Bilder gefunden</i>';
                unmuteServerSwitch();
            });
    });
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
        muteBrowserButton();
        unmuteFolderSelector();
        e.target.innerHTML = 'Server starten';
        document.querySelector('#server-status').innerHTML = '<i>Server beendet</i>';
        document.querySelectorAll('.server-run-indicator').forEach((el) => {
            el.classList.remove('text-success');
            el.classList.remove('fa-check-circle');
            el.classList.add('fa-circle');
        });
    } else {
        muteFolderSelector();
        startServer();
        unmuteBrowserButton();
        e.target.innerHTML = 'Server stoppen';
        document.querySelector('#server-status').innerHTML = '<i>Server gestartet unter http://localhost:3000</i>';
        document.querySelectorAll('.server-run-indicator').forEach((el) => {
            el.classList.remove('fa-circle');
            el.classList.add('fa-check-circle');
            el.classList.add('text-success');
        });
    }
});

// open links in external browser
var externalButtons = document.getElementsByClassName('open-external');

for (var i = 0; i < externalButtons.length; i++) {
    externalButtons[i].addEventListener('click', function(e) {
        e.preventDefault();
        var target = '';

        if (this.href) {
            target = this.href;
        } else if (this.formAction) {
            target = this.formAction;
        }

        ipcRenderer.send('openexternalpage', target);
    }, false);
}

// stop server on shutdown
ipcRenderer.on('app-shutdown', (event, arg) => {
    stopServer();
})

// Set app version
var elements = document.getElementsByClassName('ls-version');

for (const element of elements) {
    element.innerHTML = packageData.name + ' ' + packageData.version;
}
