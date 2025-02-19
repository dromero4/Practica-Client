
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
      width = data.width;
      height = data.height;

      console.log("Configuración del juego actualizada:", data);
    } else if (data.type === "coord") {
      console.log("Coordenadas recibidas:", data.x, data.y);

      //Funcion pa q pinte en el canvas

    } else {
      if (data.type === 'estat_joc') {
        if (data.running) {
          // console.log(width);
          // console.log(height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);

          let coord = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };

          fetch("http://localhost:8081/coord", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: coord })
          })
            .then(response => response.json())
            .then(data => {
              alert("✅ Configuració enviada correctament!");
              console.log("📩 Resposta del servidor:", data);
            })
            .catch(error => {
              alert("❌ Error en enviar la configuració.");
              console.error("Error:", error);
            });
        } else {
          window.location.href = "index.html";
        }
      }
    }
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
  }
};

