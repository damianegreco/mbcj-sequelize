/**
 * @file Archivo principal que exporta utilidades de base de datos.
 * @description Este módulo centraliza y re-exporta las funciones de conexión,
 * inicialización y relación de la base de datos para un fácil acceso
 * desde otras partes de la aplicación.
 * @module mbcj-sequelize
 */

const { crearConexion, iniciarDB } = require('./conexion');
const { relacionar } = require('./relacionar');

module.exports = {
  crearConexion,
  iniciarDB,
  relacionar
}