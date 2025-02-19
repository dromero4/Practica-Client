import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import fs from 'fs';
import formidable from 'formidable';
import cors from 'cors';
import WebSocket, { WebSocketServer } from 'ws';

// Crear servidor WebSockets i escoltar en el port 8180
const wsServer = new WebSocketServer({ port: 8180 });
console.log("Servidor WebSocket escoltant en http://localhost:8180");
// Enviar missatge a tothom excepte a 'clientExclos'
//	(si no s'especifica qui és el 'clientExclos', s'envia a tots els clients)
function broadcast(missatge, clientExclos) {
  wsServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN && client !== clientExclos) {
      client.send(missatge);
    }
  });
}

let ultimaConfiguracio = null;
// Al rebre un nou client (nova connexió)
wsServer.on("connection", (client, peticio) => {
  let id = peticio.socket.remoteAddress + ":" + peticio.socket.remotePort;
  client.send(JSON.stringify({ type: "benvinguda", message: `Benvingut ${id}` }));
  broadcast(JSON.stringify({ type: "nou_client", message: `Nou client afegit: ${id}` }), client);

  console.log(`Benvingut ${id}`);
  console.log(`Nou client afegit: ${id}`);

  // Si hay una configuración guardada, enviarla al nuevo cliente
  if (ultimaConfiguracio) {
    client.send(JSON.stringify({ type: "configuració", ...ultimaConfiguracio }));
  }

  client.on("message", missatge => {
    console.log(`Missatge de ${id} --> ${missatge}`);
    broadcast(JSON.stringify({ type: "missatge", id: id, message: missatge }));
  });
});

/******************************************************************************
*						SERVIDOR WEB (port 8080)
******************************************************************************/
import { createServer } from 'http';
import { parse } from 'url';
import { existsSync, readFile } from 'fs';
function header(resposta, codi, cType) {
  resposta.setHeader('Access-Control-Allow-Origin', '*');
  resposta.setHeader('Access-Control-Allow-Methods', 'GET');
  if (cType) resposta.writeHead(codi, { 'Content-Type': cType });
  else resposta.writeHead(codi);
}
function enviarArxiu(resposta, dades, filename, cType, err) {
  if (err) {
    header(resposta, 400, 'text/html');
    resposta.end("<p style='text-align:center;font-size:1.2rem;font-weight:bold;color:red'>Error al l legir l'arxiu</p>");
    return;
  }
  header(resposta, 200, cType);
  resposta.write(dades);
  resposta.end();
}
function onRequest(peticio, resposta) {
  let cosPeticio = "";
  peticio.on('error', function (err) {
    console.error(err);
  }).on('data', function (dades) {
    cosPeticio += dades;
  }).on('end', function () {
    resposta.on('error', function (err) {
      console.error(err);
    });
    if (peticio.method == 'GET') {
      let q = parse(peticio.url, true);
      let filename = "." + q.pathname;
      if (filename == "./") filename += "index.html";
      if (existsSync(filename)) {
        readFile(filename, function (err, dades) {
          enviarArxiu(resposta, dades, filename, undefined, err);
        });
      }
      else {
        header(resposta, 404, 'text/html');
        resposta.end("<p style='text-align:center;font-size:1.2rem;font-weight:bold;color:red'>404 Not Found</p>");
      }
    }
  });
}
let server = createServer();
server.on('request', onRequest);
server.listen(8080);
console.log("Servidor escoltant en http://localhost:8080");
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const IMAGES_FOLDER = path.join(__dirname, 'imagenesCanva');
const app = express();
app.use(cors());
const PORT = 8081;
// Middleware per convetir JSON
app.use(express.json());
// Servir arxius estàtics des de la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));
// Carpeta on es troben les plantilles (arxius .ejs)
//	i el motor que s'utilitzarà per generar les pàgines html
app.set('views', path.join(__dirname, '../plantilles'));
app.set('view engine', 'ejs');






app.post("/configurar", (req, res) => {
  const { width, height, pisos } = req.body;
  if (!width || !height || !pisos) {
    return res.status(400).json({ error: "Falten paràmetres." });
  }

  ultimaConfiguracio = { width, height, pisos };
  console.log("Nova configuració:", ultimaConfiguracio);

  // Enviar configuración a todos los clientes WebSocket
  wsServer.clients.forEach(client => {
    if (client.readyState === 1) { // Verifica si el cliente está abierto
      client.send(JSON.stringify({ type: "configuració", ...ultimaConfiguracio }));
    }
  });

  res.json({ message: "Configuració rebuda!", ultimaConfiguracion: ultimaConfiguracio });
});

app.post('/joc', (req, res) => {
  let joc = req.body.action;

  if (joc == "engegar") {
    broadcast(JSON.stringify({ type: "estat_joc", running: true }));
  } else if (joc == "aturar") {
    broadcast(JSON.stringify({ type: "estat_joc", running: false }));
  } else {
    return res.status(400).json({ error: "Acció no vàlida." });
  };
});

app.post('/coord', (req, res) => {
  let { x, y } = req.body.type;
  console.log("Coordenades rebudes:", { x, y });

  broadcast(JSON.stringify({ type: "coord", x, y }));
  console.log("Coordenades enviades a tots els clients.");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor responent en http://localhost:${PORT}`);
});
