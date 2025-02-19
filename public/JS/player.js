// Crear la conexión con el servidor WebSocket
const socket = new WebSocket('ws://localhost:8180');

// Enviar el mensaje para añadir jugador cuando se abra la conexión
socket.onopen = () => {
  socket.send('afegir jugador');
};

// Recibir y procesar los mensajes enviados por el servidor
socket.onmessage = (event) => {
  try {
    // Convertir la cadena JSON a objeto
    const data = JSON.parse(event.data);
    if (data.type === "configuració") {
      // Actualizar la configuración en la interfaz, por ejemplo:
      document.getElementById('width').value = data.width;
      document.getElementById('height').value = data.height;
      document.getElementById('pisos').value = data.pisos;
      console.log("Configuración del juego actualizada:", data);
    } else {
      // Procesar otros tipos de mensajes
      console.log("Mensaje recibido:", data);
    }
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
  }
};

// Gestionar errores de conexión
socket.onerror = (error) => {
  alert('Error en la conexión: ' + error);
  window.location.href = 'index.html';
};

// Gestionar el cierre de la conexión
socket.onclose = () => {
  alert('La conexión se ha cerrado.');
  window.location.href = 'index.html';
};
