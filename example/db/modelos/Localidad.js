const { DataTypes } = require('sequelize');

/**
 * Define el modelo de Sequelize para la entidad 'Localidad'.
 * @function definir
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize para la conexión a la base de datos.
 * @returns {import('sequelize').ModelCtor<any>} El modelo 'Localidad' inicializado.
 */
function definir(sequelize) {
  // Define el esquema del modelo 'Localidad'.
  const Localidad = sequelize.define('localidad', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Desconocido'
    }
  }, {
    // Opciones adicionales del modelo.
    tableName: 'localidades', // Asegura que el nombre de la tabla sea plural.
    paranoid: true // Habilita el borrado lógico (soft delete).
  });

  return Localidad;
}

module.exports = definir;