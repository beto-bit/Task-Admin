const tasks = document.querySelector('#tasks');
const { ipcRenderer } = require('electron');
const Store = require('electron-store');

// Inicializar Store y Obtener Datos
let store = new Store();
let storedTasks = store.get('tasks');


// Cambiar formato de Fecha
for (let stored in storedTasks) {
  storedTasks[stored].date = new Date(storedTasks[stored].date);
}

// Crear Tarjetas HTML
for (const stored in storedTasks) {
  tasks.innerHTML += newTaskTemplate(storedTasks[stored]);
}


// Recibir información
ipcRenderer.on('new:task', (e, newTask) => {
  // Plantilla para Tarea
  const taskTemplate = newTaskTemplate(newTask);

  tasks.innerHTML += taskTemplate;
  deleteTask();
});


// Borrar
deleteTask();

function deleteTask() {
  const btns = document.querySelectorAll('.btn.btn-danger');
  btns.forEach(btn => {
    btn.addEventListener('click', e => {
      let taskID = e.target.parentNode.parentNode.parentNode.id;
      taskID = taskID.slice(1);
      store.delete(`tasks.${taskID}`);
      e.target.parentElement.parentElement.parentElement.remove();
    });
  });
}


// Tarjeta HTML
function newTaskTemplate(newTask) {
  let presentableDate = `${newTask.date.getDate()} de ${month(newTask.date.getMonth())} de ${newTask.date.getFullYear()}`;

  return `
    <div class="p-2" id="t${newTask.id}">
    <div class="card text-center p-1">
        <div class="card-header">
          <h5 class="card-title">${newTask.name}</h5>
        </div>
        <div class="card-body">
          ${newTask.subject}
          <hr>
          <div style="max-width: 150px; margin: auto;">
            ${newTask.description}
          </div>
          <hr>
          ${presentableDate}
          <hr>
          ${day(newTask.date.getDay())} ${newTask.date.getHours()}:${newTask.date.getMinutes()}
        </div>
        <div class="card-footer">
          <button class="btn btn-danger btn-sm">
            BORRAR
          </button>
        </div>
    </div>
    </div>
  `;
}

// Día
function day(num) {
  return [
    'Domingo', 
    'Lunes', 
    'Martes', 
    'Miércoles', 
    'Jueves', 
    'Viernes', 
    'Sábado'
  ][num];
}

// Mes
function month(num) {
  return [
    'Enero', 
    'Febrero', 
    'Marzo', 
    'Abril', 
    'Mayo', 
    'Junio', 
    'Julio', 
    'Agosto', 
    'Septiembre', 
    'Octubre', 
    'Noviembre', 
    'Diciembre'
  ][num];
}