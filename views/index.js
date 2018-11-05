const { dialog } = require('electron').remote;

var selectedPath = null;

var selectFolder = function (selectedPath) {
    document.querySelector('#path-selected').innerHTML = selectedPath;
    document.querySelectorAll('.path-selected-indicator').forEach((el) => {
        el.classList.remove('fa-circle');
        el.classList.add('fa-check-circle');
        el.classList.add('text-success');
    });
};

var unselectFolder = function () {
    document.querySelector('#path-selected').innerHTML = "<i>Kein Ordner gewählt</i>";
    document.querySelectorAll('.path-selected-indicator').forEach((el) => {
        el.classList.remove('text-success');
        el.classList.remove('fa-check-circle');
        el.classList.add('fa-circle');
    });
};

var unmuteServerSwitch = function () {
    document.querySelector('.server-run-indicator').parentElement.classList.remove('text-muted');
    document.querySelector('#server-switch').disabled = false;
};

var muteServerSwitch = function () {
    document.querySelector('.server-run-indicator').parentElement.classList.add('text-muted');
    document.querySelector('#server-switch').disabled = true;
};

var handleSelectedFolder = function (filePaths) {
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
