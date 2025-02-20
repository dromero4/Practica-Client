export function cordenadasJuego(width, height) {
    // Genera las coordenadas del jugador
    const coordJugador = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
    };

    // Genera un arreglo de 10 coordenadas para la madera
    const coordMadera = [];
    for (let i = 0; i < 10; i++) {
        coordMadera.push({
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        });
    }

    // Define las coordenadas de la base (esquinas del tablero)
    const base = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: width - 1, y: 0 },
        bottomLeft: { x: 0, y: height - 1 },
        bottomRight: { x: width - 1, y: height - 1 }
    };

    // Retorna el JSON con los tres objetos integrados
    return JSON.stringify({
        type: 'IniciarJuego',
        coordJugador,
        coordMadera,
        base
    });
}
