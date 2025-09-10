/**
 * @file Archivo principal de inicialización de la base de datos.
 * @description Este script se encarga de configurar y establecer la conexión
 * con la base de datos, definir los modelos y sus relaciones, y finalmente
 * sincronizar el esquema con la base de datos.
 */

// Importación de utilidades de base de datos.
const { crearConexion, relacionar } = require('../../index');

const { DB: db, DBUSER: user, DBPASS: pass, DBHOST: host, DBPORT: port } = process.env;

const sequelize = crearConexion({ db, user, pass, host, port });

const Localidad = require('./modelos/Localidad')(sequelize);
const Provincia = require('./modelos/Provincia')(sequelize);

// Una provincia tiene muchas localidades, y una localidad pertenece a una provincia.
relacionar('muchos-uno', Localidad, Provincia, 'provincia', 'localidades', 'provincia_id');

module.exports = {sequelize};