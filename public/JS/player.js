

let posicionesJugadores;
let posicionPiedras;
let base;
let miPosicion;
let miId;


// Crear la conexión con el servidor WebSocket
const socket = new WebSocket('ws://localhost:8180');
let width;
let height;
// Enviar el mensaje para añadir jugador cuando se abra la conexión
socket.onopen = () => {
  socket.send(JSON.stringify({ action: 'afegir jugador' }));
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

    if (data.type === "actualizar_posicion") {
      // 1. Actualizar la posición en tu array local de jugadores
      posicionesJugadores = posicionesJugadores.map((jugador) => {
        if (jugador.id === data.id) {
          return {
            ...jugador,
            x: data.x,
            y: data.y
          };
        }
        return jugador;
      });

      // Si es tu propio jugador, actualiza también tu variable local miPosicion
      if (data.id === miId) {
        miPosicion.x = data.x;
        miPosicion.y = data.y;
      }
      dibujar(miId, posicionesJugadores, posicionPiedras);
    }
    // console.log("Configuración del juego:", data);
    let canvas = document.getElementById('gameCanvas');
    if (typeof data === 'string') {
      // Si és un simple missatge de text
      // console.log('Missatge de text del servidor:', data);
    } else {
      // Gestionem segons el tipus rebut
      switch (data.type) {
        case 'configuració':
          width = data.width;
          height = data.height;
          // console.log("Configuración del juego actualizada:", data);
          break;
        case 'idJugador':
          //  alert(data.message);
          miId = data.message;
          // console.log("Configuración del juego actualizada:", data);
          break;
        case "CoordenadasJuego":
          posicionesJugadores = data.posicionesJugadores;
          posicionPiedras = data.posicionPiedras;
          base = data.base;

          //Funcion para verificar colision de jugadores
          // checkCollision()

          //Funcion para verificar colision de piedras
          //checkPebbleCollision()

          break;
        case 'misCoodenadas':
          console.log("Entra aquí", data);
          // console.log(`${data.id} posicion:`, 'x:'+data.posicion.x, 'y:'+data.posicion.y);
          miPosicion = data;
          break;
        case 'estat_joc':
          if (data.running) {
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            coordenadasJuego = datosJuego(posicionesJugadores, posicionPiedras);
            console.log('Piedras:', coordenadasJuego.piedras);
            console.log('Jugadores:', coordenadasJuego.jugadores);

            dibujar(miId, coordenadasJuego.jugadores, coordenadasJuego.piedras)

          } else {
            // window.location.href = "index.html";
          }
          break;
        // Afegeix altres casos segons necessitats...
        default:
          console.log('Missatge desconegut:', data);
      }
    }
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
  }
};

function datosJuego(coordenadasJugadores, coordenadasPiedras) {
  console.log('Actualizando datos del juego');

  return {
    jugadores: [...coordenadasJugadores],
    piedras: coordenadasPiedras
  };
}


function dibujar(miId, jugadores, piedras) {
  // Obtenemos el canvas y su contexto 2D
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Limpiamos el canvas antes de dibujar
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujamos a los jugadores
  jugadores.forEach((jugador) => {
    if (jugador.id === miId) {
      ctx.fillStyle = "red";      // Mi posición se mantiene en rojo
    } else if (jugador.equipo) {
      ctx.fillStyle = "orange";   // Jugadores de equipo true se pintan en amarillo
    } else {
      ctx.fillStyle = "blue";     // Los demás se pintan en azul
    }

    ctx.fillRect(jugador.x, jugador.y, 20, 20);
  });

  // Dibujamos las piedras
  piedras.forEach((piedra) => {
    ctx.fillStyle = "black";

    ctx.fillRect(piedra.x, piedra.y, 10, 10);
  });
}

document.addEventListener("keydown", (event) => {
  let movimiento;

  switch (event.key) {
    case "ArrowUp":
    case "w":
      movimiento = "arriba";
      break;
    case "ArrowDown":
    case "s":
      movimiento = "abajo";
      break;
    case "ArrowLeft":
    case "a":
      movimiento = "izquierda";
      break;
    case "ArrowRight":
    case "d":
      movimiento = "derecha";
      break;
    default:
      return;
  }
  socket.send(JSON.stringify({
    type: "movimiento",
    id: miId, // Identificador del jugador
    movimiento: movimiento
  }));
});
