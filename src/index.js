const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');


// Variables
let mainWindow;
let newTaskWindow;


// Ventana PRINCIPAL 
app.on('ready', () => {
  // Inicializar
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true }
  });

  // TODO: cuando carga el asunto meter ese código que hace que sea mas mejor xd

  // HTML
  mainWindow.loadURL(`file://${__dirname}/views/index.html`);

  // Navegación
  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);

  // Evento de Cierre
  mainWindow.on('closed', () => {
    app.quit();
  });
});


// NUEVA Ventana
function createNewProductWindow() {
  // Inicializar
  newTaskWindow = new BrowserWindow ({
    width: 400,
    height: 445, // TODO esto luego ponerlo a 430
    webPreferences: { nodeIntegration: true },
    // parent: mainWindow
    // TODO Si se puede investigar que onda con lo de arriba y eso :p
  });

  // TODO decomentar esto
  // newTaskWindow.setMenu(null)

  // Cargar el HTML
  newTaskWindow.loadURL(`file://${__dirname}/views/new-task.html`);

  /* No creo que sea necesario TODO (eliminarlo si no es necesario)
  newTaskWindow.on('closed', () => {
    newTaskWindow = null;
  });
  */
}


// Recibir Información
ipcMain.on('task:new', (e, newTask) => {
  mainWindow.webContents.send('new:task', newTask);
  newTaskWindow.close();
});


// Navegación
const templateMenu = [
  // File
  {
    label: 'Archivo',
    submenu: [
      // Nueva Tarea
      {
        label: 'Nueva Tarea',
        accelerator: 'Ctrl+N',
        click() {
          createNewProductWindow();
        }
      }, // TODO: poner el borrón de Unde y Redo antes que el de 'Remover Tod0'

      { type: 'separator' },
      
      // Salida
      {
        label: 'Salir',
        accelerator: 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];


// Hot reload
if (process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node-modules', '.bin', 'electron')
  });
}

// DevTools
if (process.env.NODE_ENV !== 'production') {
  templateMenu.push({
    label: 'DevTools',
    submenu: [
      // Toggle DevTools
      {
        label: 'Show/Hide',
        accelerator: 'Ctrl+I',
        click(item, focusedWindows) {
          focusedWindows.toggleDevTools();
        }
      },

      // Reload
      {
        role: 'reload'
      }
    ]
  })
}