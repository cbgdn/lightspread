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
const { app, BrowserWindow } = require('electron');
const isDevEnv = ('ELECTRON_IS_DEV' in process.env);

function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({ width: 800, height: 600 });

    // and load the index.html of the app.
    // win.loadFile('index.html');

    // Open the DevTools if in dev environment
    if (isDevEnv) {
        mainWindow.webContents.openDevTools({mode: 'detach'});
    }
}

app.on('ready', createWindow);
