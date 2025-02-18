export function encriptar(accion, text) {
    let resultado = "";

    if (accion === 'encriptar') {
        // Aquí agregas tu lógica de encriptación
        resultado = text.split('').reverse().join('');
    } else if (accion === 'desencriptar') {
        // Aquí agregas tu lógica de desencriptación
        resultado = text.split('').reverse().join('');
    } else {
        throw new Error("Acción no válida");
    }

    return resultado;
}
