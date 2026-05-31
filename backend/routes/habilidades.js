const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET /api/habilidades
// regresa el catalogo completo de habilidades ordenado por categoria
router.get("/", (req, respuesta) => {

    // trae todas las habilidades con el nombre de su categoria
    const consultaCatalogoHabilidades = db.prepare(`
        SELECT habilidades.id, habilidades.nombre, categorias.nombre AS categoria
        FROM habilidades JOIN categorias ON habilidades.categoria_id = categorias.id
        ORDER BY categorias.nombre, habilidades.nombre
    `);
    const habilidades = consultaCatalogoHabilidades.all();

    respuesta.json(habilidades);
});

// exporta el router para usarlo en app.js
module.exports = router;