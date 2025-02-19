
// Crear la conexión con el servidor WebSocket
const socket = new WebSocket('ws://localhost:8180');
let width;
let height;
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
            width= data.width;
            height= data.height
            
            console.log("Configuración del juego actualizada:", data);
            // Aquí se puede invocar la función para dibujar el tablero:
            
        }else{
          if (data.type === 'estat_joc'){
            if (data.running) {
            // console.log(width);
            // console.log(height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
       
            }else{
              window.location.href = "index.html";
            }
        }
   
     
    }
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
  }
};

