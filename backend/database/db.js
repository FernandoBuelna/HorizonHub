const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// crea o abre la base de datos — si no existe la crea automaticamente
const db = new Database(path.join(__dirname, "horizonhub.db"));

// activa las foreign keys
db.pragma("foreign_keys = ON");

// lee el schema.sql y lo ejecuta para crear las tablas
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
db.exec(schema);

// exporta la conexion para usarla en otros archivos
module.exports = db;