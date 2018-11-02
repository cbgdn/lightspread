const { dialog } = require('electron').remote;

document.querySelector('.folder-selector').addEventListener('click', (e) => {
    var path = dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    document.querySelector('.path-selected').innerHTML = path[0];

    console.log(path);
});
