const express = require("express");
const router = express.Router();
const db = require("../database/db");

// PUT /api/experiencias/:id
// actualiza una experiencia academica
router.put("/:id", (req, respuesta) => {

    const idExperiencia = req.params.id;

    // busca la experiencia actual para conservar sus datos si no se mandan todos
    const consultaBuscarExperiencia = db.prepare("SELECT * FROM experiencias WHERE id = ?");
    const experiencia = consultaBuscarExperiencia.get(idExperiencia);

    // si no existe manda error 404
    if (!experiencia) {
        return respuesta.status(404).json({ error: "Experiencia no encontrada" });
    }

    // actualiza solo los campos que se mandaron
    const consultaActualizarExperiencia = db.prepare(`
        UPDATE experiencias SET titulo = ?, institucion = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ?, descripcion = ? WHERE id = ?
    `);
    consultaActualizarExperiencia.run(
        req.body.titulo ?? experiencia.titulo,
        req.body.institucion ?? experiencia.institucion,
        req.body.tipo ?? experiencia.tipo,
        req.body.fecha_inicio ?? experiencia.fecha_inicio,
        req.body.fecha_fin ?? experiencia.fecha_fin,
        req.body.descripcion ?? experiencia.descripcion,
        idExperiencia
    );

    respuesta.json({ mensaje: "Experiencia actualizada correctamente" });
});

// DELETE /api/experiencias/:id
// elimina una experiencia academica
router.delete("/:id", (req, respuesta) => {

    const idExperiencia = req.params.id;

    // verifica que la experiencia exista
    const consultaBuscarExperiencia = db.prepare("SELECT id FROM experiencias WHERE id = ?");
    const experiencia = consultaBuscarExperiencia.get(idExperiencia);

    // si no existe manda error 404
    if (!experiencia) {
        return respuesta.status(404).json({ error: "Experiencia no encontrada" });
    }

    // elimina la experiencia
    const consultaEliminarExperiencia = db.prepare("DELETE FROM experiencias WHERE id = ?");
    consultaEliminarExperiencia.run(idExperiencia);

    respuesta.json({ mensaje: "Experiencia eliminada correctamente" });
});

// exporta el router para usarlo en app.js
module.exports = router;