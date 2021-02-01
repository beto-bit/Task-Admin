const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const Store = require('electron-store');
const path = require('path');

// Inicializar Store
let store = new Store({
  counter: {
    type: 'number',
    minimum: 0,
    default: 0
  }
});
store.path = path.join(__dirname, '/data/data.json');


// Función de ID
function nextId() {
  store.set('counter', store.get('counter') + 1);
  if (store.get('counter') === null) {
    store.set('counter', 0);
  }
  return store.get('counter');
}


// Ventanas
let mainWindow;
let newTaskWindow;


// VENTANA PRINCIPAL
function createMainWindow() {
  // Propiedades
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
    mainWindow.show();
  });

  // Evento de Cierre
  mainWindow.on('closed', () => {
    app.quit();
  });
}


// Ventana de NUEVA TAREA
function createNewTaskWindow() {
  // Propiedades
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


// Inicializar VENTANA PRINCIPAL
app.on('ready', () => {
  createMainWindow();
});


// Recibir y Enviar Información
ipcMain.on('task:new', (e, newTask) => {
  // Enviar a index.html
  mainWindow.webContents.send('new:task', newTask);
  newTaskWindow.close();

  // Guardar Datos
  let ID = nextId().toString();
  store.set(`tasks.${ID}`, newTask);
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
    electron: path.join(__dirname, '../node-modules', '.bin', 'electron'),
    ignored: /data\/|[/\\]\./ // Archivos de Guardado
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
      },

      // Reset Data
      {
        label: 'Reset Data',
        accelerator: 'Ctrl+W',
        click() {
          store.clear();
        }
      }
    ]
  })
}