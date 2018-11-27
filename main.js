/*
 * LightSpread
 * Copyright (C) 2018  Artur Weigandt  https://wlabs.de/kontakt

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
const { app, BrowserWindow, ipcMain, nativeImage, shell } = require('electron');
const isDevEnv = ('ELECTRON_IS_DEV' in process.env);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let galleryWindow = null;



let createMainWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 700,
        height: 400,
    });

    // and load the index.html of the app.
    mainWindow.loadFile('views/index.html');

    // Open the DevTools if in dev environment
    if (isDevEnv) {
        mainWindow.webContents.openDevTools({mode: 'detach'});
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // Emitted when the application is quitting.
    mainWindow.on('quit', () => {
        mainWindow.webContents.send('app-shutdown');
    });

    let galleryWindow = null;

    ipcMain.on('opengallery', createGalleryWindow);

    ipcMain.on('closegallery', closeGalleryWindow);

    ipcMain.on('openexternalpage', function (e, url) {
        shell.openExternal(url);
    });
};

let createGalleryWindow = (e, arg) => {
    // Do nothing if gallery already started
    if (galleryWindow !== null) {
        return;
    }

    galleryWindow = new BrowserWindow({
        // width: 800,
        // height: 600,
        // parent: mainWindow,
        // frame: true,
        fullscreen: true,
        backgroundColor: '#333333',
        autoHideMenuBar: true,
        title: 'LightSpread Gallery',
        icon: nativeImage.createFromPath('./img/lightspread-256.png'),
    });

    // galleryWindow.webContents.openDevTools({mode: 'bottom'});

    galleryWindow.once('ready-to-show', () => {
        galleryWindow.show();
        // galleryWindow.focus();
    });

    // Allow leave fullscreen with esc
    galleryWindow.webContents.on('before-input-event', (e, input) => {
        if (input.type != 'keyUp') {
            return;
        }

        if (galleryWindow.isFullScreen() && (input.key == 'Escape' || input.key == 'F11')) {
            e.preventDefault();
            galleryWindow.setFullScreen(false);
        } else if (! galleryWindow.isFullScreen() && input.key == 'F11') {
            e.preventDefault();
            galleryWindow.setFullScreen(true);
        }
    });

    // Minimize main window
    mainWindow.minimize();

    galleryWindow.loadURL(arg);

    galleryWindow.on('closed', () => {
         galleryWindow = null;
    });
};

let closeGalleryWindow = (e) => {
    if (galleryWindow) {
        galleryWindow.close();
        galleryWindow = null;
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createMainWindow();
    }
});
