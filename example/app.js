/**
 * @file Archivo principal y punto de entrada de la aplicación Express.
 * @description Configura e inicia el servidor web, carga las variables de entorno,
 * inicializa la conexión con la base de datos y define las rutas principales.
 * @author Tu Nombre <tu.email@example.com>
 * @version 1.0.0
 */

const express = require('express');
const path = require('path');

// Carga las variables de entorno desde el archivo .env
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Inicializa la conexión con la base de datos
require('./db/main').sequelize.iniciarDB();

const { PORT } = process.env;
const app = express();

/**
 * @api {get} / Estado de la Aplicación
 * @apiName GetAppStatus
 * @apiGroup Servidor
 * @apiDescription Endpoint para verificar el estado del servidor. Confirma que la aplicación está
 * en línea y que la conexión inicial a la base de datos se ha establecido.
 *
 * @apiSuccess {String} body Mensaje de texto plano indicando que la aplicación funciona correctamente.
 *
 * @apiSuccessExample {string} Respuesta Exitosa:
 * HTTP/1.1 200 OK
 * "App con db conectada correctamente"
 */
app.get('/', function(req, res) {
  res.send('App con db conectada correctamente');
});

// Define el puerto de escucha, usando 3000 como valor por defecto.
const listenPort = PORT ?? 3000;

// Inicia el servidor Express.
app.listen(listenPort, function(error) {
  if (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
  console.log(`Servidor escuchando en el puerto ${listenPort}`);
});