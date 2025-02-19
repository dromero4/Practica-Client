import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import fs from 'fs';
import formidable from 'formidable';
import cors from 'cors';
import WebSocket, { WebSocketServer } from 'ws';
// Crear servidor WebSockets i escoltar en el port 8180
const wsServer = new WebSocketServer({ port: 8180 })
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
// Al rebre un nou client (nova connexió)
wsServer.on("connection", (client, peticio) => {
  // Guardar identificador (IP i Port) del nou client
  let id = peticio.socket.remoteAddress + ":" + peticio.socket.remotePort;

  // Enviar salutació en format JSON
  client.send(JSON.stringify({ type: "benvinguda", message: `Benvingut ${id}` }));

  // Avisar a tots els altres que s'ha afegit un nou client
  broadcast(JSON.stringify({ type: "nou_client", message: `Nou client afegit: ${id}` }), client);

  console.log(`Benvingut ${id}`);
  console.log(`Nou client afegit: ${id}`);

  // Al rebre un missatge d'aquest client
  client.on("message", missatge => {
    console.log(`Missatge de ${id} --> ${missatge}`);

    // Enviar el missatge a tots en format JSON
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

// // Ruta d'inici (http://localhost:3000)
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public', 'index.html'));
// });
// Ruta amb paràmetre (http://localhost:3000/hola/peter)
// app.get('/hola/:nom', (req, res) => {
//     res.send(`¡Hola, ${req.params.nom}!`);
// });
app.get('/list-files', (req, res) => {
  fs.readdir(IMAGES_FOLDER, (err, files) => {
    if (err) {
      return res.status(500).json({ error: err.toString() });
    }

    // Leer cada archivo .txt y devolver un array con { filename, content }
    const result = files.map(fileName => {
      const fullPath = path.join(IMAGES_FOLDER, fileName);
      const base64Content = fs.readFileSync(fullPath, 'utf8');
      // Si en tu caso NO incluyes el prefijo en el .txt, deberías añadirlo aquí:
      // const base64Content = 'data:image/png;base64,' + fs.readFileSync(fullPath, 'utf8');

      return {
        fileName,
        content: base64Content
      };
    });

    res.json(result);
  });
});
app.get('/imagenesCanva/:fileName', (req, res) => {
  const filePath = path.join(IMAGES_FOLDER, req.params.fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Archivo no encontrado');
  }
  res.sendFile(filePath);
});

app.post('/dades', (req, res) => {
  console.log("Cuerpo de la petición recibida:", req.body); // Debug
  let { nombre, accion, text } = req.body; // Extrae los valores
  if (!accion || !text) {
    return res.status(400).json({ error: "Faltan datos en la petición" });
  }


});
// Para el formulario:
app.post('/upload', (req, res) => {
  const form = formidable();  // Sin 'new'

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).send('Error procesando el formulario');
    }
    console.log('Campos:', fields);
    console.log('Archivos:', files);
    res.send('Archivo recibido correctamente');
  });
});

app.post("/configurar", (req, res) => {
  let configuracionJoc;
  const { width, height, pisos } = req.body;
  if (!width || !height || !pisos) {
    return res.status(400).json({ error: "Falten paràmetres." });
  }

  configuracionJoc = { width, height, pisos };
  console.log("Nova configuració:", configuracionJoc);

  // Enviar configuración a todos los clientes WebSocket
  // wss.clients.forEach(client => {
  //     if (client.readyState === 1) { // Verifica si el cliente está abierto
  //         client.send(JSON.stringify({ type: "configuració", ...configuracionJoc }));
  //     }
  // });

  res.json({ message: "Configuració rebuda!", configuracionJoc });
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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor responent en http://localhost:${PORT}`);
});
