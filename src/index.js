const { app, BrowserWindow } = require('electron');

// Variables
let mainWindow;


// Inicialización 
app.on('ready', () => {
  mainWindow = new BrowserWindow({});
});