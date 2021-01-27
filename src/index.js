const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Hot reload
if (process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node-modules', '.bin', 'electron')
  });
}

// Variables
let mainWindow;
let newTaskWindow;


// Ventana PRINCIPAL 
app.on('ready', () => {
  // Inicializar
  mainWindow = new BrowserWindow({});

  // HTML
  mainWindow.loadURL(`file://${__dirname}/views/index.html`);

  // Navegación
  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);
});

// NUEVA Ventana
function createNewProductWindow() {
  // Inicializar
  newTaskWindow = new BrowserWindow ({
    width: 500,
    height: 330,
    title: 'Nueva Tarea'
  });

  // Cargar el HTML
  newTaskWindow.loadURL(`file://${__dirname}/views/new-task.html`);
}

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
      }
    ]
  }
];