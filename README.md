# mbcj-sequelize

[![Licencia: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Descripción del Proyecto

`mbcj-sequelize` es una librería para Node.js diseñada para simplificar y agilizar la configuración, conexión y gestión de relaciones en proyectos que utilizan Sequelize como ORM. Esta utilidad centraliza la lógica de conexión a la base de datos (especialmente PostgreSQL), la sincronización de modelos y la creación de asociaciones, permitiendo a los desarrolladores enfocarse en la lógica de negocio en lugar de en la configuración repetitiva.

El público objetivo son desarrolladores de Node.js que buscan una manera más limpia y modular de integrar Sequelize en sus aplicaciones.

---

## Características

-   **Conexión Simplificada**: Crea una instancia de Sequelize y establece la conexión con la base de datos a través de una única función, utilizando variables de entorno.
-   **Inicialización Flexible**: Sincroniza los modelos con la base de datos utilizando métodos flexibles como `sync`, `alter` o `force`.
-   **Gestor de Relaciones**: Incluye una función `relacionar` que abstrae la complejidad de definir asociaciones `uno a uno`, `muchos a uno` y `muchos a muchos`.
-   **Modularidad**: Diseñado para ser fácilmente integrable en cualquier proyecto Node.js, promoviendo una estructura de base de datos limpia y organizada.

---

## Estructura del Proyecto

La librería se compone de los siguientes archivos principales:

-   `index.js`: Punto de entrada principal que exporta todas las utilidades de la librería.
-   `conexion.js`: Contiene las funciones `crearConexion` para instanciar Sequelize y `iniciarDB` para autenticar y sincronizar la base de datos.
-   `relacionar.js`: Exporta la función `relacionar`, diseñada para establecer asociaciones entre los modelos de Sequelize de forma declarativa.

---

## Tecnologías y Dependencias

Este proyecto se basa en las siguientes tecnologías:

-   [Node.js](https://nodejs.org/)
-   [Sequelize](https://sequelize.org/): ORM para Node.js.
-   [pg](https://www.npmjs.com/package/pg): Cliente de PostgreSQL para Node.js.
-   [pg-hstore](https://www.npmjs.com/package/pg-hstore): Serializador de datos para el tipo HSTORE de PostgreSQL.

---

## Instalación

1.  **Instalar el paquete**:
    Añade la librería a tu proyecto usando npm:
    ```sh
    npm install mbcj-sequelize
    ```

2.  **Configurar Variables de Entorno**:
    Crea un archivo `.env` en la raíz de tu proyecto para configurar las credenciales de la base de datos.
    ```ini
    DB="nombre_de_tu_db"
    DBUSER="usuario_db"
    DBPASS="contraseña_db"
    DBHOST="localhost"
    DBPORT="5432"
    ```

---

## Uso

A continuación, se muestra un ejemplo completo de cómo utilizar `mbcj-sequelize` para configurar la base de datos, definir modelos y establecer relaciones.

### 1. Crear el archivo de inicialización de la DB

Crea un archivo principal para gestionar la base de datos (por ejemplo, `db/index.js`). Este archivo se encargará de todo el proceso.

```javascript
// db/index.js

// 1. Importar las utilidades de la librería
const { crearConexion, iniciarDB, relacionar } = require('mbcj-sequelize');

// (Asegúrate de cargar las variables de entorno, por ejemplo con dotenv)
// require('dotenv').config();

// 2. Extraer las credenciales desde process.env
const { DB: db, DBUSER: user, DBPASS: pass, DBHOST: host, DBPORT: port } = process.env;

// 3. Crear la instancia de Sequelize
const sequelize = crearConexion({ db, user, pass, host, port });

// 4. Importar y definir los modelos
const Provincia = require('./modelos/Provincia')(sequelize);
const Localidad = require('./modelos/Localidad')(sequelize);

// 5. Establecer las relaciones entre modelos
// Una provincia tiene muchas localidades (relación muchos a uno)
relacionar('muchos-uno', Localidad, Provincia, 'provincia', 'localidades', 'provincia_id');

// 6. Iniciar y sincronizar la base de datos
iniciarDB(sequelize, 'sync') // puedes usar 'alter' o 'force' en desarrollo
  .then((tipo) => console.log(`Conexión y sincronización (${tipo}) exitosa.`))
  .catch((error) => console.error('Error al inicializar la base de datos:', error));

// Opcional: exportar los modelos para usarlos en otras partes de la app
module.exports = {
  Provincia,
  Localidad
};
```

### 2. Definir los Modelos

Crea tus modelos de Sequelize en archivos separados. Cada archivo debe exportar una función que recibe `sequelize` y devuelve el modelo definido.

**Ejemplo de Modelo `Provincia`**:
```javascript
// modelos/Provincia.js
const { DataTypes } = require('sequelize');

function definir(sequelize) {
  const Provincia = sequelize.define('provincia', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'provincias',
    paranoid: true // Habilita borrado lógico
  });

  return Provincia;
}

module.exports = definir;
```

**Ejemplo de Modelo `Localidad`**:
```javascript
// modelos/Localidad.js
const { DataTypes } = require('sequelize');

function definir(sequelize) {
  const Localidad = sequelize.define('localidad', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
    // Sequelize añadirá automáticamente 'provincia_id' por la relación
  }, {
    tableName: 'localidades',
    paranoid: true
  });

  return Localidad;
}

module.exports = definir;
```

### 3. Cargar la configuración en tu App

Finalmente, solo necesitas importar el archivo de inicialización de la base de datos en el punto de entrada de tu aplicación (por ejemplo, `app.js` o `index.js`).

```javascript
// app.js
const express = require('express');
require('dotenv').config(); // Carga las variables de entorno

// Inicializa la conexión con la base de datos
require('./db'); // Esto ejecutará el código de db/index.js

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Aplicación conectada a la base de datos.');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
```