const { ipcRenderer } = require('electron');
const tasks = document.querySelector('#tasks');

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

// Recibir información
ipcRenderer.on('new:task', (e, newTask) => {
  const presentableDate = `${newTask.date.getDate()} de ${month(newTask.date.getMonth())} de ${newTask.date.getFullYear()}`;

  // Plantilla para Tarea
  const newTaskTemplate = `
    <div class="p-2">
    <div class="card text-center p-1">
        <div class="card-header">
          <h5 class="card-title">${newTask.name}</h5>
        </div>
        <div class="card-body">
          ${newTask.subject}
          <hr>
          ${newTask.description}
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

  tasks.innerHTML += newTaskTemplate;

  // Borrar
  const btns = document.querySelectorAll('.btn.btn-danger');
  btns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.target.parentElement.parentElement.parentElement.remove();
    });
  });
});