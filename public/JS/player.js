// Crear la conexión con el servidor WebSocket
const socket = new WebSocket('ws://localhost:8180');

// Enviar el mensaje para añadir jugador cuando se abra la conexión
socket.onopen = () => {
  socket.send('afegir jugador');
};

// Recibir y procesar los mensajes enviados por el servidor
socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    let canvas = document.getElementById('gameCanvas');
    if (data.type === "configuració") {
      canvas.setAttribute('width', data.width);
      canvas.setAttribute('height', data.height);
      console.log("Configuración del juego actualizada:", data);
      // Aquí se puede invocar la función para dibujar el tablero:
      drawBoard(data.width, data.height, data.pisos);
    } else {
      console.log("Mensaje recibido3:", data);
    }
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
  }
};

function drawBoard(width, height, pisos) {
  const boardElement = document.getElementById('gameCanvas');
  // Limpiar el contenido anterior
  boardElement.innerHTML = '';

  // Suponiendo que 'width' y 'height' definen la cuadrícula base del juego
  for (let row = 0; row < height; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'board-row';
    for (let col = 0; col < width; col++) {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'board-cell';
      // Aquí se puede aplicar lógica extra para representar distintos "pisos" o elementos
      rowDiv.appendChild(cellDiv);
    }
    boardElement.appendChild(rowDiv);
  }
}
