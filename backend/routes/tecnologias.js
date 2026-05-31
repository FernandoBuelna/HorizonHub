const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET /api/tecnologias
// regresa el catalogo completo de tecnologias ordenado por categoria
router.get("/", (req, respuesta) => {

    // trae todas las tecnologias con el nombre de su categoria
    const consultaCatalogoTecnologias = db.prepare(`
        SELECT tecnologias.id, tecnologias.nombre, categorias.nombre AS categoria FROM tecnologias
        JOIN categorias ON tecnologias.categoria_id = categorias.id ORDER BY categorias.nombre, tecnologias.nombre
    `);
    const tecnologias = consultaCatalogoTecnologias.all();

    respuesta.json(tecnologias);
});

module.exports = router;