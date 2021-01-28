const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const Store = require('electron-store');
const path = require('path');


// Variables
let mainWindow;
let newTaskWindow;


// Ventana PRINCIPAL 
app.on('ready', () => {
  // Inicializar
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '/icons/icon.png'),
    show: false,
    webPreferences: { nodeIntegration: true }
  });

  // HTML
  mainWindow.loadURL(`file://${__dirname}/views/index.html`);

  // Navegación
  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);

  // Mostrar
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  });

  // Evento de Cierre
  mainWindow.on('closed', () => {
    app.quit();
  });
});


// NUEVA Ventana
function createNewTaskWindow() {
  // Inicializar
  newTaskWindow = new BrowserWindow ({
    width: 400,
    height: 430, 
    show: false,
    parent: mainWindow,
    resizable: false,
    minimizable: false,
    webPreferences: { nodeIntegration: true }
  });
  
  // Sin navegación
  newTaskWindow.setMenu(null)

  // Cargar el HTML
  newTaskWindow.loadURL(`file://${__dirname}/views/new-task.html`);

  // Cargar cuando esté lista
  newTaskWindow.once('ready-to-show', () => {
    newTaskWindow.show()
  });
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
          createNewTaskWindow();
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