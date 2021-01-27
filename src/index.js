const { app, BrowserWindow, Menu } = require('electron');

// Hot reload
if (process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    // Cosas
  });
}

// Variables
let mainWindow;


// Inicialización 
app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/views/index.html`);
});