
// Crear la conexión con el servidor WebSocket
const socket = new WebSocket('ws://localhost:8180');
let width;
let height;
// Enviar el mensaje para añadir jugador cuando se abra la conexión
socket.onopen = () => {
  socket.send('afegir jugador');
};
socket.onclose = function (event) {
  alert('La connexió s\'ha tancat. Motiu: ' + (event.reason || 'Desconegut'));
  // Redirigir a index.html a la mateixa pestanya
  window.location.href = 'index.html';
};

// Quan es produeix un error
socket.onerror = function (error) {
  alert('S\'ha produït un error en la connexió WebSocket.');
  // Redirigir a index.html a la mateixa pestanya
  window.location.href = 'index.html';
};
// Recibir y procesar los mensajes enviados por el servidor
socket.onmessage = (event) => {
  try {



    const data = JSON.parse(event.data);
    console.log("Configuración del juego:", data);

    let canvas = document.getElementById('gameCanvas');

    if (typeof data === 'string') {
      // Si és un simple missatge de text
      console.log('Missatge de text del servidor:', data);
    } else {
      // Gestionem segons el tipus rebut
      switch (data.type) {
        case 'configuració':
          width = data.width;
          height = data.height;

          console.log("Configuración del juego actualizada:", data);

          break;

        case 'estat_joc':
          if (data.running) {
            // console.log(width);
            // console.log(height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);


          } else {
            window.location.href = "index.html";
          }
          break;
        case 'coord':
          console.log("Coordenadas recibidas:", data.coord.x, data.coord.y);


        // Afegeix altres casos segons necessitats...
        default:
          console.log('Missatge desconegut:', data);
      }
    }
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
  }
};


