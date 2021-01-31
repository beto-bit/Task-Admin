const { ipcRenderer } = require('electron');
const form = document.querySelector('form');

// Submit
addEventListener('submit', e => {
      
  // datetime-local a Date
  function convertDateType(date) {
    let year = date.slice(0, 4);
    let month = date.slice(5, 7) - 1;
    let day = date.slice(8, 10);
    let hour = date.slice(11, 13);
    let minute = date.slice(14, 16); 
         
    let actualDate = new Date(year, month, day, hour, minute);
    return actualDate;
    }

  // Objeto Enviado
  const newTask = {
    name: document.querySelector('#name').value,
    subject: document.querySelector('#subject').value,
    description: document.querySelector('#description').value,
    date: convertDateType(document.querySelector('#date').value)
  }

  // Enviar Información
  ipcRenderer.send('task:new', newTask);

  e.preventDefault();
});