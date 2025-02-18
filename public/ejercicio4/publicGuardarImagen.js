import { recargarListaArchivos, restaurarEnCanvas, enviarJSON } from './metodosAyaxDibujar.js';

let host;
if (window.location.protocol === "file:") {
  host = "localhost";
} else {
  host = window.location.hostname;
}

const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const sizePicker = document.getElementById("sizePicker");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");
const nombreArchivo = document.getElementById("nombreArchivo");
const restoreBtn = document.getElementById("restoreBtn");
let atras = document.getElementById('volverAInicio');

let painting = false;

function startPosition(e) {
  painting = true;
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;
  ctx.lineWidth = sizePicker.value;
  ctx.lineCap = "round";
  ctx.strokeStyle = colorPicker.value;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function getBase64Image() {
  return canvas.toDataURL("image/png");
}

saveBtn.addEventListener("click", () => {
  const imagenBase64 = getBase64Image();
  let nombreImagen = nombreArchivo.value;
  enviarJSON(nombreImagen, 'guardarCanva', imagenBase64);
});



atras.addEventListener("click", () => {

    window.location.href = '../index.html';


});


