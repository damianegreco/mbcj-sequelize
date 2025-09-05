/**
 * @typedef {'uno-uno' | 'muchos-uno' | 'muchos-muchos'} TipoRelacion
 * Tipos de relaciones de base de datos permitidas.
 */

// Define los tipos de relaciones válidas que se pueden crear.
const tiposRelacion = ['uno-uno', 'muchos-uno', 'muchos-muchos'];

/**
 * Establece una relación entre dos modelos de base de datos (presumiblemente Sequelize).
 * Esta función actúa como una fábrica para configurar diferentes tipos de asociaciones
 * de manera consistente.
 * @function relacionar
 * @param {TipoRelacion} relacion - El tipo de relación a crear: 'uno-uno', 'muchos-uno', 'muchos-muchos'.
 * @param {object} modeloA - El modelo de origen de la relación.
 * @param {object} modeloB - El modelo de destino de la relación.
 * @param {string} asA - Alias para la relación en el modelo A, que apunta hacia el modelo B.
 * @param {string} asB - Alias para la relación en el modelo B, que apunta hacia el modelo A.
 * @param {string} campoA - Clave foránea. Para 'muchos-muchos', es la clave foránea de `modeloA` en la tabla pivote.
 * @param {string} [campoB] - Clave foránea de `modeloB` en la tabla pivote (solo requerido para 'muchos-muchos').
 * @param {object} [modeloC] - El modelo de la tabla pivote (solo requerido para 'muchos-muchos').
 * @throws {Error} Si el tipo de relación proporcionado no es válido.
 * @returns {void}
 */
const relacionar = function(relacion, modeloA, modeloB, asA, asB, campoA, campoB, modeloC) {
  // Objeto que mapea los tipos de relación a sus funciones de configuración específicas.
  const manejadoresRelacion = {
    'uno-uno': (modA, modB, aliasA, aliasB, campo) => {
      modA.belongsTo(modB, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', foreignKey: campo, sourceKey: 'id', as: aliasA });
      modB.hasOne(modA, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', foreignKey: campo, sourceKey: 'id', as: aliasB });
    },
    'muchos-uno': (modA, modB, aliasA, aliasB, campo) => {
      modA.belongsTo(modB, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', foreignKey: campo, sourceKey: 'id', as: aliasA });
      modB.hasMany(modA, { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', foreignKey: campo, sourceKey: 'id', as: aliasB });
    },
    'muchos-muchos': (modA, modB, aliasA, aliasB, fkA, fkB, modPivote) => {
      modA.belongsToMany(modB, { as: aliasA, through: modPivote, foreignKey: fkA, sourceKey: 'id' });
      modB.belongsToMany(modA, { as: aliasB, through: modPivote, foreignKey: fkB, sourceKey: 'id' });
    }
  };

  if (!tiposRelacion.includes(relacion)) throw new Error('Método no válido');

  return manejadoresRelacion[relacion](modeloA, modeloB, asA, asB, campoA, campoB, modeloC);
};

module.exports = { relacionar };