const { Sequelize } = require('sequelize');

/**
 * Crea y configura una nueva instancia de Sequelize para la conexión a la base de datos.
 * @function crearConexion
 * @param {object} config - Objeto de configuración para la base de datos.
 * @param {string} [config.user="user"] - Nombre de usuario de la base de datos.
 * @param {string} [config.pass=""] - Contraseña del usuario.
 * @param {string} [config.host="localhost"] - Host de la base de datos.
 * @param {string} [config.port="5432"] - Puerto de la base de datos.
 * @param {string} [config.db="database"] - Nombre de la base de datos.
 * @returns {Sequelize} Una instancia de Sequelize configurada y lista para conectar.
 */

function crearConexion({ user = 'user', pass = '', host = 'localhost', port = '5432', db = 'database' }) {
  const cn = `postgres://${user}:${pass}@${host}:${port}/${db}`;
  const sequelize = new Sequelize(cn, { logging: false });
  return sequelize;
}

/**
 * Autentica la conexión a la base de datos y sincroniza los modelos.
 * @function iniciarDB
 * @param {Sequelize} sequelize - La instancia de Sequelize a utilizar.
 * @param {'sync' | 'force' | 'alter'} [tipo='sync'] - El tipo de sincronización a realizar.
 * 'sync': crea tablas si no existen. 'force': elimina las tablas y las vuelve a crear. 'alter': modifica las tablas para que coincidan con el modelo.
 * @returns {Promise<string>} Una promesa que resuelve con el tipo de sincronización realizado si tiene éxito, o rechaza con un error si falla.
 */
function iniciarDB(sequelize, tipo = 'sync') {
  return new Promise((resolve, reject) => {
    sequelize.authenticate()
      .then(() => sequelize.sync({ [tipo]: true }))
      .then(() => resolve(tipo))
      .catch(reject);
  });
}

module.exports = { crearConexion, iniciarDB };