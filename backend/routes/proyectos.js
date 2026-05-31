const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET /api/proyectos
// busca proyectos por nombre usando parametros en la URL
// ejemplo: /api/proyectos?q=HorizonHub
router.get("/", (req, respuesta) => {

    // lee el parametro de busqueda de la URL
    const terminoBusqueda = req.query.q || "";

    // busca proyectos por nombre o tecnologia
    const consultaBuscarProyectos = db.prepare(`
    SELECT proyectos.id, proyectos.nombre, proyectos.descripcion, proyectos.repo_url, proyectos.destacado, proyectos.estudiante_id, estudiantes.nombre AS autor,
    GROUP_CONCAT(tecnologias.nombre) AS tecnologias FROM proyectos JOIN estudiantes ON proyectos.estudiante_id = estudiantes.id
    LEFT JOIN proyecto_tecnologia ON proyectos.id = proyecto_tecnologia.proyecto_id LEFT JOIN tecnologias 
    ON proyecto_tecnologia.tecnologia_id = tecnologias.id
    WHERE (proyectos.nombre LIKE ? OR tecnologias.nombre LIKE ?) GROUP BY proyectos.id
    `);
    const proyectos = consultaBuscarProyectos.all(`%${terminoBusqueda}%`, `%${terminoBusqueda}%`);
    // convierte las tecnologias de texto a arreglo
    proyectos.forEach(proyecto => {
        proyecto.tecnologias = proyecto.tecnologias ? proyecto.tecnologias.split(",") : [];
    });
    respuesta.json(proyectos);
});

// POST /api/proyectos
// crea un nuevo proyecto asociado a un estudiante
router.post("/", (req, respuesta) => {

    const idEstudiante = req.body.estudiante_id;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const repoUrl = req.body.repo_url;
    const destacado = req.body.destacado || 0;
    const tecnologias = req.body.tecnologias || [];

    if (!idEstudiante || !nombre) {
        return respuesta.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const consultaBuscarEstudiante = db.prepare("SELECT id FROM estudiantes WHERE id = ?");
    const estudiante = consultaBuscarEstudiante.get(idEstudiante);

    if (!estudiante) {
        return respuesta.status(404).json({ error: "Estudiante no encontrado" });
    }

    const consultaCrearProyecto = db.prepare(`
        INSERT INTO proyectos (estudiante_id, nombre, descripcion, repo_url, destacado) VALUES (?, ?, ?, ?, ?)
    `);
    const resultado = consultaCrearProyecto.run(idEstudiante, nombre, descripcion, repoUrl, destacado);
    const idProyecto = resultado.lastInsertRowid;

    const consultaAgregarTecnologia = db.prepare(`
        INSERT OR IGNORE INTO proyecto_tecnologia (proyecto_id, tecnologia_id) VALUES (?, ?)
    `);
    tecnologias.forEach(idTecnologia => {
        consultaAgregarTecnologia.run(idProyecto, idTecnologia);
    });

    respuesta.status(201).json({
        mensaje: "Proyecto creado correctamente",
        id: idProyecto
    });
});

// GET /api/proyectos/:id/tecnologias
// regresa las tecnologias de un proyecto especifico
router.get("/:id/tecnologias", (req, respuesta) => {

    const idProyecto = req.params.id;

    const consultaTecnologias = db.prepare(`
        SELECT tecnologias.id, tecnologias.nombre FROM proyecto_tecnologia
        JOIN tecnologias ON proyecto_tecnologia.tecnologia_id = tecnologias.id
        WHERE proyecto_tecnologia.proyecto_id = ?
    `);
    const tecnologias = consultaTecnologias.all(idProyecto);

    respuesta.json(tecnologias);
});

// GET /api/proyectos/:id
// regresa la informacion de un proyecto especifico con sus tecnologias
router.get("/:id", (req, respuesta) => {

    const idProyecto = req.params.id;

    const consultaBuscarProyecto = db.prepare("SELECT * FROM proyectos WHERE id = ?");
    const proyecto = consultaBuscarProyecto.get(idProyecto);

    if (!proyecto) {
        return respuesta.status(404).json({ error: "Proyecto no encontrado" });
    }

    // agrega las tecnologias al objeto del proyecto
    const consultaTecnologias = db.prepare(`
        SELECT tecnologias.id, tecnologias.nombre FROM proyecto_tecnologia
        JOIN tecnologias ON proyecto_tecnologia.tecnologia_id = tecnologias.id
        WHERE proyecto_tecnologia.proyecto_id = ?
    `);
    proyecto.tecnologias = consultaTecnologias.all(idProyecto);

    respuesta.json(proyecto);
});

// PUT /api/proyectos/:id
// actualiza un proyecto existente y sus tecnologias
router.put("/:id", (req, respuesta) => {

    const idProyecto = req.params.id;

    const consultaBuscarProyecto = db.prepare("SELECT * FROM proyectos WHERE id = ?");
    const proyecto = consultaBuscarProyecto.get(idProyecto);

    if (!proyecto) {
        return respuesta.status(404).json({ error: "Proyecto no encontrado" });
    }

    const consultaActualizarProyecto = db.prepare(`
        UPDATE proyectos SET nombre = ?, descripcion = ?, repo_url = ?, destacado = ? WHERE id = ?
    `);
    consultaActualizarProyecto.run(
        req.body.nombre ?? proyecto.nombre,
        req.body.descripcion ?? proyecto.descripcion,
        req.body.repo_url ?? proyecto.repo_url,
        req.body.destacado ?? proyecto.destacado,
        idProyecto
    );

    // borra las tecnologias actuales y reinsertas las nuevas
    const tecnologias = req.body.tecnologias || [];
    const consultaEliminarTecnologias = db.prepare("DELETE FROM proyecto_tecnologia WHERE proyecto_id = ?");
    consultaEliminarTecnologias.run(idProyecto);

    const consultaAgregarTecnologia = db.prepare(`
        INSERT OR IGNORE INTO proyecto_tecnologia (proyecto_id, tecnologia_id) VALUES (?, ?)
    `);
    tecnologias.forEach(idTecnologia => {
        consultaAgregarTecnologia.run(idProyecto, idTecnologia);
    });

    respuesta.json({ mensaje: "Proyecto actualizado correctamente" });
});

// DELETE /api/proyectos/:id
// elimina un proyecto y sus relaciones con tecnologias
router.delete("/:id", (req, respuesta) => {

    const idProyecto = req.params.id;

    const consultaBuscarProyecto = db.prepare("SELECT id FROM proyectos WHERE id = ?");
    const proyecto = consultaBuscarProyecto.get(idProyecto);

    if (!proyecto) {
        return respuesta.status(404).json({ error: "Proyecto no encontrado" });
    }

    const consultaEliminarProyecto = db.prepare("DELETE FROM proyectos WHERE id = ?");
    consultaEliminarProyecto.run(idProyecto);

    respuesta.json({ mensaje: "Proyecto eliminado correctamente" });
});

// PUT /api/proyectos/:id/destacado
router.put("/:id/destacado", (req, respuesta) => {
    const idProyecto = req.params.id;
    const destacado = req.body.destacado;

    const consultaBuscarProyecto = db.prepare(
        "SELECT id FROM proyectos WHERE id = ?"
    );

    const proyecto = consultaBuscarProyecto.get(idProyecto);

    if (!proyecto) {
        return respuesta.status(404).json({
            error: "Proyecto no encontrado"
        });
    }

    const consultaActualizar = db.prepare(
        "UPDATE proyectos SET destacado = ? WHERE id = ?"
    );

    consultaActualizar.run(destacado, idProyecto);
    respuesta.json({
        mensaje: "Proyecto actualizado correctamente"
    });
});

module.exports = router;