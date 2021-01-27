const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');


// Variables
let mainWindow;
let newTaskWindow;


// Ventana PRINCIPAL 
app.on('ready', () => {
  // Inicializar
  mainWindow = new BrowserWindow({});

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
    width: 500,
    height: 330,
    title: 'Nueva Tarea',
    // parent: mainWindow
    // TODO Si se puede investigar que onda con lo de arriba y eso :p
  });

  newTaskWindow.setMenu(null)

  // Cargar el HTML
  newTaskWindow.loadURL(`file://${__dirname}/views/new-task.html`);

  /* No creo que sea necesario TODO (eliminarlo si no es necesario)
  newTaskWindow.on('closed', () => {
    newTaskWindow = null;
  });
  */
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
      }, // TODO: poner el borrón de Unde y Redo antes que el de 'Remover Todo'

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