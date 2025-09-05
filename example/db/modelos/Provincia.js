const { DataTypes } = require('sequelize');

/**
 * Define el modelo de Sequelize para la entidad 'Provincia'.
 * @function definir
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize para la conexión a la base de datos.
 * @returns {import('sequelize').ModelCtor<any>} El modelo 'Provincia' inicializado.
 */
function definir(sequelize) {
  // Define el esquema del modelo 'Provincia'.
  const Provincia = sequelize.define('provincia', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Desconocido'
    }
  }, {
    // Opciones adicionales del modelo.
    tableName: 'provincias', // Asegura que el nombre de la tabla sea plural.
    paranoid: true // Habilita el borrado lógico (soft delete).
  });

  return Provincia;
}

module.exports = definir;