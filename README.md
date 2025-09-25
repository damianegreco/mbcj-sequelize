# mbcj-sequelize

[![Licencia: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Descripción del Proyecto

`mbcj-sequelize` es una librería para Node.js diseñada para simplificar y agilizar la configuración, conexión y gestión de relaciones en proyectos que utilizan Sequelize como ORM. Esta utilidad centraliza la lógica de conexión a la base de datos (PostgreSQL), la sincronización de modelos y la creación de asociaciones, permitiendo a los desarrolladores enfocarse en la lógica de negocio en lugar de en la configuración repetitiva.

El público objetivo son desarrolladores de Node.js que buscan una manera más limpia y modular de integrar Sequelize en sus aplicaciones.

---

## Características

-   **Conexión Simplificada**: Crea una instancia de Sequelize y establece la conexión con la base de datos a través de una única función (`crearConexion`), utilizando un objeto de configuración o variables de entorno.
-   **Inicialización Flexible**: Autentica y sincroniza los modelos con la base de datos mediante un método (`iniciarDB`) que soporta diferentes estrategias como `sync` (por defecto), `alter` o `force`.
-   **Gestor de Relaciones Declarativo**: Incluye una función (`relacionar`) que abstrae la complejidad de definir asociaciones `uno-uno`, `muchos-uno` y `muchos-muchos` entre modelos de una manera más legible.
-   **Modularidad**: Promueve una estructura de base de datos limpia y organizada, siendo fácilmente integrable en cualquier proyecto Node.js.

---

## Estructura del Proyecto

La librería se compone de los siguientes archivos principales:

-   `index.js`: Punto de entrada que exporta las utilidades `crearConexion`, `iniciarDB` y `relacionar` para un fácil acceso.
-   `conexion.js`: Contiene la lógica para crear la instancia de Sequelize (`crearConexion`) y para sincronizar la base de datos (`iniciarDB`).
-   `relacionar.js`: Exporta la función `relacionar`, diseñada para establecer asociaciones entre los modelos de Sequelize.
-   `example/`: Un directorio con un proyecto de ejemplo funcional que demuestra cómo utilizar la librería en una aplicación Express.

---

## Tecnologías y Dependencias

**Dependencias de producción:**
-   [Sequelize](https://sequelize.org/): ORM para Node.js.
-   [pg](https://www.npmjs.com/package/pg): Cliente de PostgreSQL para Node.js.
-   [pg-hstore](https://www.npmjs.com/package/pg-hstore): Serializador/deserializador para el tipo de dato HSTORE de PostgreSQL.

**Dependencias de desarrollo (para el ejemplo):**
-   [Express](https://expressjs.com/): Framework web para Node.js.
-   [Dotenv](https://www.npmjs.com/package/dotenv): Para cargar variables de entorno desde un archivo `.env`.
-   [Nodemon](https://nodemon.io/): Herramienta que reinicia automáticamente la aplicación cuando detecta cambios.

---

## Instalación

1.  **Añade la librería a tu proyecto**:
    ```sh
    npm install mbcj-sequelize
    ```

2.  **Configura las Variables de Entorno**:
    Crea un archivo `.env` en la raíz de tu proyecto para configurar las credenciales de la base de datos.
    ```ini
    DB="nombre_de_la_db"
    DBUSER="usuario_db"
    DBPASS="contraseña_db"
    DBHOST="localhost"
    DBPORT="5432"
    ```

---

## Uso

A continuación, se muestra un ejemplo de cómo utilizar `mbcj-sequelize` para configurar la base de datos, definir modelos y establecer relaciones en una aplicación Express.

### 1. Inicialización de la Base de Datos

Crea un archivo para gestionar la configuración de la base de datos (ej. `db/main.js`).

```javascript
// db/main.js
const { crearConexion, relacionar } = require('mbcj-sequelize');

// Asegúrate de haber cargado las variables de entorno previamente (ej. con dotenv)
const { DB: db, DBUSER: user, DBPASS: pass, DBHOST: host, DBPORT: port } = process.env;

// 1. Crea la instancia de Sequelize
const sequelize = crearConexion({ db, user, pass, host, port });

// 2. Define tus modelos pasándoles la instancia de sequelize
const Localidad = require('./modelos/Localidad')(sequelize);
const Provincia = require('./modelos/Provincia')(sequelize);

// 3. Establece las relaciones entre los modelos
// Una provincia tiene muchas localidades (relación muchos a uno)
relacionar('muchos-uno', Localidad, Provincia, 'provincia', 'localidades', 'provincia_id');

// 4. Exporta la instancia para usarla en tu aplicación
module.exports = { sequelize };
```

### 2. Definición de Modelos

Crea tus modelos de Sequelize en archivos separados. Cada modelo debe exportar una función que recibe `sequelize` y devuelve el modelo definido.

**Modelo `Provincia.js`**:
```javascript
// modelos/Provincia.js
const { DataTypes } = require('sequelize');

function definir(sequelize) {
  const Provincia = sequelize.define('provincia', {
    nombre: {
      type: DataTypes.STRING,
      defaultValue: 'Desconocido'
    }
  }, {
    tableName: 'provincias',
    paranoid: true // Habilita borrado lógico (soft delete)
  });

  return Provincia;
}

module.exports = definir;
```

**Modelo `Localidad.js`**:
```javascript
// modelos/Localidad.js
const { DataTypes } = require('sequelize');

function definir(sequelize) {
  const Localidad = sequelize.define('localidad', {
    nombre: {
      type: DataTypes.STRING,
      defaultValue: 'Desconocido'
    }
    // Sequelize añadirá automáticamente 'provincia_id' debido a la relación
  }, {
    tableName: 'localidades',
    paranoid: true
  });

  return Localidad;
}

module.exports = definir;
```

### 3. Integración en la Aplicación Principal

En el punto de entrada de tu aplicación (ej. `app.js`), importa la configuración de la base de datos e inicia la conexión.

```javascript
// app.js
const express = require('express');
const path = require('path');

// Carga las variables de entorno
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Importa la instancia de sequelize y la inicializa
const { sequelize } = require('./db/main');
sequelize.iniciarDB('sync') // Puedes usar 'alter' o 'force' en desarrollo
  .then(tipo => console.log(`Base de datos conectada y sincronizada (${tipo}).`))
  .catch(err => console.error('Error al iniciar la base de datos:', err));

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('App con db conectada correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
```

---

## Licencia

Este proyecto está bajo la Licencia ISC. Consulta el archivo `LICENSE` para más detalles.

---

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en abrir un "issue" en el repositorio.

* **Nombre del Autor**: Damian Greco