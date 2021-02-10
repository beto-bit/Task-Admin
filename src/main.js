const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const Store = require('electron-store');
const path = require('path');

// Inicializar Store
Store.initRenderer(); 
let store = new Store({
  counter: {
    type: 'number',
    minimum: 0,
    default: 0
  },
  theme: {
    type: 'string'
  }
});


// Función de ID
function nextId() {
  store.set('counter', store.get('counter') + 1);
  if (store.get('counter') === null) {
    store.set('counter', 0);
    store.set('theme', 'light-theme');
  }
  return store.get('counter');
}


// Themes
function toggleTheme(theme) {
  let code = `
  togglePromise = new Promise((resolve, reject) => {
    document.body.style.display = 'none';
    resolve();
  });
  togglePromise
    .then(function changeStyle(response) {
      theme = document.getElementById('theme-link');
      theme.href = "css/${theme}.css";
    })
    .then(function showAgain(response) {
      document.body.style.display = 'block';
    })
    .catch(function notOk(err) {console.error(err)} );
  `;
  mainWindow.webContents.executeJavaScript(code);

  store.set('theme', theme);
}


// Ventanas
let mainWindow;
let newTaskWindow;


// VENTANA PRINCIPAL
function createMainWindow() {
  // Propiedades
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '/icons/icon_light.png'),
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
    icon: path.join(__dirname, 'icons/new_task_light.png'),
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


// Manejo de DATOS
ipcMain.on('task:new', (e, newTask) => {  
  // Guardar Datos
  let ID = nextId().toString();
  newTask.id = ID;
  store.set(`tasks.${ID}`, newTask);

  // Enviar a index.html
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
      }, 

      // Separador
      { type: 'separator' },

      // Tema de Color
      {
        label: 'Tema de Color',
        submenu: [
          // Light Theme
          { label: 'Tema Claro', click() { toggleTheme('light-theme'); } },
          // Dark Theme
          {label: 'Tema Oscuro', click() { toggleTheme('dark-theme'); }},
          // Cyborg Theme
          {label: 'Tema Cyborg', click() { toggleTheme('cyborg-theme'); }},
          // Solarized Theme
          {label: 'Tema Solarizado', click() { toggleTheme('solar-theme'); }}

        ]
      },

      // Separador
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
if (!(app.isPackaged)) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node-modules', '.bin', 'electron'),
  });
}

// DevTools
if (!(app.isPackaged)) {
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