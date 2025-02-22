
function generarCoordenadasAleatorias(width, height) {
    return {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
    };
}

export function generarCoordenadasJugador(width, height) {
    const margin = 20; // Margen para evitar que el jugador se salga del canvas
    // Generamos coordenadas dentro del área reducida (dejando margen en cada lado)
    const { x, y } = generarCoordenadasAleatorias(width - 2 * margin, height - 2 * margin);
    // Ajustamos las coordenadas sumando el margen para ubicarlas correctamente
    return { x: x + margin, y: y + margin };
  }


export function generarCoordenadasPiedra(width, height, cantidad = 10) {
    const coordPiedra = [];
    const margin = 20; // Margen para evitar que las piedras se salgan del canvas
    const minDist = 30; // Distancia mínima entre piedras para evitar superposición

    while (coordPiedra.length < cantidad) {
        // Generamos coordenadas dentro de un área reducida para dejar margen en cada lado
        const { x, y } = generarCoordenadasAleatorias(width - 2 * margin, height - 2 * margin);
        const nuevaCoordenada = { x: x + margin, y: y + margin };

        // Verificar si la nueva coordenada está lo suficientemente lejos de las anteriores
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

  

export function generarCoordenadasBase(width, height) {
    return {
        topLeft: { x: 0, y: 0 },
        bottomRight: { x: width - 1, y: height - 1 }
    };
}

export function coordenadasJuego(width, height) {
    return JSON.stringify({
        type: 'IniciarJuego',
        coordJugador: generarCoordenadasJugador(width, height),
        coordPiedra: generarCoordenadasPiedra(width, height),
        base: generarCoordenadasBase(width, height)
    });
}




