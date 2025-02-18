let host;
if (window.location.protocol === "file:") {
  host = "localhost";
} else {
  host = window.location.hostname;
}

// Esperamos a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {

  /* ----------------- LÓGICA PARA DIBUJAR EN SVG ----------------- */
  const svg = document.getElementById("canvas");
  let drawing = false;
  let path;
  let pathData = [];
  let drawings = []; // Array para almacenar los trazos dibujados

  // mousedown: Iniciamos el trazado
  svg.addEventListener("mousedown", (e) => {
    drawing = true;
    pathData = [`M ${e.offsetX} ${e.offsetY}`];
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    svg.appendChild(path);
  });

  // mousemove: Mientras dibujamos, vamos añadiendo líneas
  svg.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    pathData.push(`L ${e.offsetX} ${e.offsetY}`);
    path.setAttribute("d", pathData.join(" "));
  });

  // mouseup: Terminamos el trazo y lo guardamos
  svg.addEventListener("mouseup", () => {
    if (drawing && path) {
      drawings.push(path.getAttribute("d"));
    }
    drawing = false;
  });

  // mouseleave: Si se sale del SVG, dejamos de dibujar
  svg.addEventListener("mouseleave", () => {
    drawing = false;
  });


  /* ----------------- BOTONES ----------------- */
  let btnRecuperar = document.getElementById('btnRecuperar');
  let btnGuardar = document.getElementById('btnGuardar');
  let atras = document.getElementById('volverAInicio');

  function restaurarDibujo(text) {
    const svgElement = document.getElementById("canvas"); // Asegúrate de que este ID exista en tu HTML
    if (!svgElement) {
        console.error("Elemento SVG no encontrado");
        return;
    }

    // Crear un nuevo elemento <path> y agregar los datos del dibujo
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", text);
    pathElement.setAttribute("stroke", "black");
    pathElement.setAttribute("fill", "none");

    // Limpiar y restaurar el dibujo en el SVG
    // svgElement.innerHTML = ""; // Opcional, si quieres limpiar el dibujo anterior
    svgElement.appendChild(pathElement);
}


  /* ----------------- EJEMPLO DE PETICIÓN POST ----------------- */
  function enviarPOST(url, params) {
    // Cuando recibimos respuesta
    function reqListener() { 
      let { accion, texto } = JSON.parse(this.responseText);
      let text = Array.isArray(texto) ? texto.join('\n') : texto; 
  
      switch (accion) {
          case 'guardar':
              console.log("Guardado con éxito");
              break;
          case 'restaurar':
              console.log("Restaurado:", text);
              restaurarDibujo(text);
              break;
      }
  }
  


    // Cuando hay un error
    function errListener() {
      alert("Error al realizar la petición al servidor");
    }

    let peticion = new XMLHttpRequest();
    peticion.addEventListener("load", reqListener);
    peticion.addEventListener("error", errListener);

    peticion.overrideMimeType("text/plain");
    peticion.open("POST", url, true);
    peticion.setRequestHeader("Content-Type", "application/json");


    peticion.send(JSON.stringify(params));
    console.log("Petición enviada");
  }

  function enviarJSON(accion, dibujo) {
    let datos = {
      accion: accion,
      text: dibujo
    };
    console.log("Enviando datos al servidor:", datos);

    // Enviamos la petición al servidor Node en localhost:3000/dades (o 'host')
    enviarPOST('http://' + host + ':3000/dades', datos);
  }

  // Botón Recuperar: de momento sin lógica
  btnRecuperar.addEventListener("click", () => {
    enviarJSON("restaurar", drawings);
  });

  // Botón Guardar: envía los trazos almacenados en 'drawings'
  btnGuardar.addEventListener("click", () => {
    console.log("Dibujo guardado en array:", drawings);
    enviarJSON("guardar", drawings);
  });
  atras.addEventListener("click", () => {

    window.location.href = 'index.html';

 
  });

});