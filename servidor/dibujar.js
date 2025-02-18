import fs from 'fs';

export function guardar(rutaArchivo, contenido) {
    fs.writeFileSync(rutaArchivo, contenido, 'utf8');
}

export function restaurar(rutaArchivo) {
    return fs.readFileSync(rutaArchivo, 'utf8');
}
import path from 'path';


export function listarArchivos(rutaCarpeta) {
    try {
        return fs.readdirSync(rutaCarpeta);
    } catch (error) {
        console.error("Error al listar archivos:", error);
        return [];
    }
}


export function leerImagenBase64(rutaCarpeta, nombreArchivo) {
    try {
      const rutaArchivo = path.join(rutaCarpeta, nombreArchivo);
      if (!fs.existsSync(rutaArchivo)) {
        console.error("El archivo no existe:", rutaArchivo);
        return null;
      }
      // Leer como texto UTF-8 (no como binario)
      const contenidoTexto = fs.readFileSync(rutaArchivo, "utf8");
      return contenidoTexto;
    } catch (error) {
      console.error("Error al leer la imagen en Base64:", error);
      return null;
    }
  }
  