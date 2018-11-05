const { dialog } = require('electron').remote;

var selectedPath = null;

document.querySelector('#folder-selector').addEventListener('click', (e) => {
    var path = dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (path) {
        selectedPath = path[0];
        document.querySelector('#path-selected').innerHTML = selectedPath;

        console.log(selectedPath);
    } else {
        selectedPath = null;
        console.log('Kein Ordner gewählt');
        document.querySelector('#path-selected').innerHTML = "<i>Kein Ordner gewählt</i>";
    }


});
