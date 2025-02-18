let host;
if (window.location.protocol == "file:") host = "localhost";
else host = window.location.hostname;

document.addEventListener("DOMContentLoaded", () => {
    // Obtener los elementos
    let btnEncriptar = document.getElementById('btnEncriptar');
    let btnDesencriptar = document.getElementById('btnDesencriptar');
    let textoEncriptar = document.getElementById('textoEncriptar');
    let textoDesencriptar = document.getElementById('textoDesencriptar');
    let atras = document.getElementById('volverAInicio');


    // Función para enviar JSON

    function enviarPOST(url, params) {

        function reqListener() {
            let dades = JSON.parse(this.responseText);

            console.log("Respuesta del servidor:", dades); // Debug en consola

            let textoDesencriptar = document.getElementById('textoDesencriptar');
            if (textoDesencriptar) {
                textoDesencriptar.value = dades.texto; // Mostrar en el input
            } else {
                console.error("Elemento 'textoDesencriptar' no encontrado.");
            }
        }

        // Gestor per si es rep un error
        function errListener() {
            alert("Error al fer petició al servidor");
        }

        // Crear l'objecte per fer la petició al servidor...
        let peticio = new XMLHttpRequest();
        // ... i assignar-li els gestors
        peticio.addEventListener("load", reqListener);
        peticio.addEventListener("error", errListener);

        // Configurar i fer la petició POST al servidor
        peticio.overrideMimeType("text/plain");
        peticio.open("POST", url, true);
        peticio.setRequestHeader("Content-Type", "application/json");
        peticio.send(JSON.stringify(params));
    }

    function enviarJSON(accion, texto) {
        let datos = {
            accion: accion,
            text: texto
        };

        //   const objeto = JSON.parse(datos.text);
        enviarPOST('http://' + host + ':3000/dades', datos);
        // leerJSON(datos)
    }
    textoDesencriptar.addEventListener("input", (event) => {
        console.log("Texto ingresado:", event.target.value);
    })
    // Eventos de clic
    btnEncriptar.addEventListener("click", () => {
        enviarJSON("encriptar", textoEncriptar.value);
    });

    btnDesencriptar.addEventListener("click", () => {
        enviarJSON("desencriptar", textoDesencriptar.value);
    });
    atras.addEventListener("click", () => {

        window.location.href = '../index.html';


    });

});