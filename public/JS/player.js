// Crear la conexión al servidor WebSocket en el puerto 8180
const socket = new WebSocket('ws://localhost:8180');

// Cuando se establece la conexión, enviar el mensaje para añadir jugador
socket.onopen = () => {
  socket.send('afegir jugador');
};

// Manejar mensajes recibidos desde el servidor
socket.onmessage = (event) => {
  console.log('Mensaje del servidor:', event.data);
  // Aquí puedes procesar la configuración del juego u otras instrucciones
};

// En caso de error, mostrar alerta y redirigir a index.html
socket.onerror = (error) => {
  alert('Error en la conexión: ' + error);
  window.location.href = 'index.html';
};

// Si se cierra la conexión, mostrar alerta y redirigir a index.html
socket.onclose = () => {
  alert('La conexión se ha cerrado.');
  window.location.href = 'index.html';
};
