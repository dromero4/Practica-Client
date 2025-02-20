export function generarCordenadas(width, height) {
    let coord = { 
        x: Math.floor(Math.random() * width), 
        y: Math.floor(Math.random() * height) 
    };
    return JSON.stringify({ type: 'coord',coord }); // Devuelve la coordenada como string JSON
}
