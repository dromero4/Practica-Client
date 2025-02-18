// Esperamos a que el DOM esté listo para evitar problemas de elementos no encontrados
document.addEventListener("DOMContentLoaded", () => {
  recargarListaArchivos();
});
let host;
if (window.location.protocol === "file:") {
  host = "localhost";
} else {
  host = window.location.hostname;
}
/**
 * Actualiza el contenedor de miniaturas leyendo el endpoint /list-files.
 * Se espera que el endpoint devuelva un array de objetos con la siguiente forma:
 * { fileName: "nombre.txt", content: "data:image/png;base64,..." }
 */
export function recargarListaArchivos() {
  fetch('/list-files')
    .then(response => response.json())
    .then(files => {
      const fileListDiv = document.getElementById('fileList');
      if (!fileListDiv) {
        console.error("No se encontró el elemento con id 'fileList'");
        return;
      }
      // Limpiar la lista actual
      fileListDiv.innerHTML = '';

      // Recorrer la lista de archivos y crear miniaturas
      files.forEach(fileObj => {
        const img = document.createElement('img');
       
        img.src = fileObj.content;
        img.classList.add('thumbnail');

      
        img.addEventListener('click', () => {
          restaurarEnCanvas(fileObj.content);
        });

        fileListDiv.appendChild(img);
      });
    })
    .catch(err => console.error('Error al obtener la lista de archivos:', err));
}

/**
 * Dibuja en el canvas la imagen que recibe en formato Base64.
 * @param {string} base64Data - La cadena Base64 completa (con prefijo)
 */
export function restaurarEnCanvas(base64Data) {
  const canvas = document.getElementById('drawCanvas');
  if (!canvas) {
    console.error("No se encontró el canvas con id 'drawCanvas'");
    return;
  }
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = base64Data;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.onerror = () => {
    console.error("Error al cargar la imagen en el canvas.");
  };
}
export function enviarJSON(nombre, accion, dibujo) {
  const datos = {
    nombre: nombre,
    accion: accion,
    text: dibujo
  };

  console.log("Enviando datos al servidor:", datos);

  fetch("http://" + host + ":3000/dades", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Respuesta recibida:", data);
      switch (data.accion) {
        case 'guardarCanva':
          console.log("Guardado con éxito");
          recargarListaArchivos(); // Actualiza la lista de archivos
          break;
        case 'restaurarImagenBase64':
          console.log("Texto recibido:", data.texto);
          if (!data.texto || data.texto.length < 50) {
            console.error("Error: La cadena Base64 está vacía o es inválida.");
            return;
          }
          restaurarEnCanvas(data.texto); // Dibuja la imagen en el canvas
          break;
        default:
          console.warn("Acción desconocida:", data.accion);
      }
    })
    .catch(error => {
      console.error("Error en la petición:", error);
    });
}