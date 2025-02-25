
function generarCoordenadasAleatorias(width, height) {
    return {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
    };
}
export function generarCoordenadasJugador(width, height) {
    const margin = 20;
    const { x, y } = generarCoordenadasAleatorias(width - 2 * margin, height - 2 * margin);
    return { x: x + margin, y: y + margin };
}
export function generarCoordenadasPiedra(width, height, cantidad = 10) {
    const coordPiedra = [];
    const margin = 20;
    const minDist = 30;
    while (coordPiedra.length < cantidad) {
        const { x, y } = generarCoordenadasAleatorias(width - 2 * margin, height - 2 * margin);
        const nuevaCoordenada = { x: x + margin, y: y + margin };
        const superpuesta = coordPiedra.some(piedra => {
            const distancia = Math.sqrt((piedra.x - nuevaCoordenada.x) ** 2 + (piedra.y - nuevaCoordenada.y) ** 2);
            return distancia < minDist; // Si está muy cerca, se considera superpuesta
        });
        if (!superpuesta) {
            coordPiedra.push(nuevaCoordenada);
        }
    }
    return coordPiedra;
}

// gameLogic.js
export function generarCoordenadasBases(width, height) {
    // Base del equipo true (abajo a la derecha)
    const baseTrue = {
      topLeft: {
        x: width - 100,   // Por ejemplo, 100 px antes del borde derecho
        y: height - 100
      },
      bottomRight: {
        x: width - 1,     // Hasta el extremo de la pantalla
        y: height - 1
      }
    };
  
    // Base del equipo false (arriba a la izquierda)
    const baseFalse = {
      topLeft: {
        x: 0,  // Empieza en 0,0
        y: 0
      },
      bottomRight: {
        x: 100, // 100 px desde la esquina superior izquierda
        y: 100
      }
    };
  
    // Devuelves un objeto con ambas bases
    return { baseTrue, baseFalse };
  }
  
export function coordenadasJuego(width, height) {
    return JSON.stringify({
        type: 'IniciarJuego',
        coordJugador: generarCoordenadasJugador(width, height),
        coordPiedra: generarCoordenadasPiedra(width, height),
        base: generarCoordenadasBase(width, height)
    });
}

// gameLogic.js
export function estaEnBase(jugador, base) {
    if (!base) {
      console.error("⚠ Error: 'base' es undefined en estaEnBase(). Revisa si las bases se han generado correctamente.");
      return false;
    }
  
    const jX1 = jugador.x;
    const jY1 = jugador.y;
    const jX2 = jugador.x + 20;
    const jY2 = jugador.y + 20;
  
    const baseX1 = base.topLeft.x;
    const baseY1 = base.topLeft.y;
    const baseX2 = base.bottomRight.x;
    const baseY2 = base.bottomRight.y;
  
    const dentroX = (jX1 >= baseX1) && (jX2 <= baseX2);
    const dentroY = (jY1 >= baseY1) && (jY2 <= baseY2);
  
    return dentroX && dentroY;
  }
  
  




