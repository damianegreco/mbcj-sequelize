const { Sequelize } = require('sequelize');

/**
 * Crea y configura una nueva instancia de Sequelize para la conexión a la base de datos.
 * @function crearConexion
 * @param {object} config - Objeto de configuración para la base de datos.
 * @param {string} [config.user='user'] - Nombre de usuario de la base de datos.
 * @param {string} [config.pass=''] - Contraseña del usuario.
 * @param {string} [config.host='localhost'] - Host de la base de datos.
 * @param {string} [config.port='5432'] - Puerto de la base de datos.
 * @param {string} [config.db='database'] - Nombre de la base de datos.
 * @returns {Sequelize} Una instancia de Sequelize configurada.
 */
function crearConexion({ user = 'user', pass = '', host = 'localhost', port = '5432', db = 'database' }) {
  const cn = `postgres://${user}:${pass}@${host}:${port}/${db}`;
  const sequelize = new Sequelize(cn, { logging: false, native: false });
  sequelize.iniciarDB = (tipo) => iniciarDB(sequelize, tipo);
  return sequelize;
}

/**
 * Autentica la conexión y sincroniza los modelos de la base de datos.
 * @function iniciarDB
 * @param {Sequelize} sequelize - La instancia de Sequelize a utilizar.
 * @param {'sync' | 'force' | 'alter'} [tipo='sync'] - El tipo de sincronización a realizar.
 * 'sync': Crea tablas si no existen. 'force': Elimina y recrea las tablas. 'alter': Modifica las tablas para que coincidan con el modelo.
 * @returns {Promise<string>} Promesa que resuelve con el tipo de sincronización realizado o rechaza con un error.
 */
function iniciarDB(sequelize, tipo = 'sync') {
  return new Promise((resolve, reject) => {
    sequelize.authenticate()
      .then(() => {
        const opciones = { sync: { force: false, alter: false }, force: { force: true }, alter: { alter: true }};
        return sequelize.sync(opciones[tipo] || opciones.sync);
      })
      .then(() => resolve(tipo))
      .catch(reject);
  });
}

module.exports = { crearConexion };