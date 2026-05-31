const express = require("express");
const router = express.Router();
const db = require("../database/db");
const bcrypt = require("bcrypt");

// POST /api/estudiantes/registro
// recibe nombre, email y password y crea un nuevo estudiante en la base de datos
router.post("/registro", (req, respuesta) => {

    // lee los datos que mando el frontend en el cuerpo de la peticion
    const nombre = req.body.nombre;
    const email = req.body.email;
    const password = req.body.password;
    const passwordHash = bcrypt.hashSync(password, 10);

    // valida que los campos obligatorios no esten vacios
    if (!nombre || !email || !password) {
        return respuesta.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // intenta insertar el nuevo estudiante en la base de datos
    try {
        // prepare construye la consulta SQL con ? para evitar inyeccion de codigo
        const consultaRegistrar = db.prepare("INSERT INTO estudiantes (nombre, email, password) VALUES (?, ?, ?)");

        // run ejecuta la consulta con los valores reales
        const resultado = consultaRegistrar.run(nombre, email, passwordHash);

        // regresa el id del estudiante recien creado
        respuesta.status(201).json({
            mensaje: "Estudiante registrado exitosamente",
            id: resultado.lastInsertRowid
        });

    } catch (error) {
        // si el email ya existe sqlite manda un error UNIQUE
        if (error.message.includes("UNIQUE")) {
            return respuesta.status(400).json({ error: "El correo ya esta registrado" });
        }
        return respuesta.status(500).json({ error: "Error al registrar el estudiante" });
    }
});

// POST /api/estudiantes/login
// recibe email y password, verifica si el estudiante existe y si la contraseña es correcta
router.post("/login", (req, respuesta) => {

    // lee los datos del cuerpo de la peticion
    const email = req.body.email;
    const password = req.body.password;

    // valida que no esten vacios
    if (!email || !password) {
        return respuesta.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // busca el estudiante por email en la base de datos
    const consultaBuscarEstudiante = db.prepare("SELECT * FROM estudiantes WHERE email = ?");
    const estudiante = consultaBuscarEstudiante.get(email);

    // si no existe manda error
    if (!estudiante) {
        return respuesta.status(400).json({ error: "El correo no esta registrado" });
    }

    // compara la contraseña usando bcrypt
    const passwordCorrecta = bcrypt.compareSync(password, estudiante.password);
    if (!passwordCorrecta) {
        return respuesta.status(400).json({ error: "Contraseña incorrecta" });
    }

    // si todo esta bien regresa los datos del estudiante sin la contraseña
    respuesta.json({
        mensaje: "Login exitoso",
        id: estudiante.id,
        nombre: estudiante.nombre,
        email: estudiante.email
    });
});

// GET /api/estudiantes
// busca estudiantes por nombre o habilidad usando el parametro q en la URL
// ejemplo: /api/estudiantes?q=Fernando
router.get("/", (req, respuesta) => {

    // req.query lee los parametros que van despues del ? en la URL
    // si no se manda nada usa cadena vacia para que traiga todos
    const terminoBusqueda = req.query.q || "";

    // busca estudiantes cuyo nombre o habilidad coincida con el termino
    // DISTINCT evita que aparezca el mismo estudiante varias veces si tiene varias habilidades
    // LIKE con % busca coincidencias parciales — %fer% encuentra "Fernando"
    const consultaBuscarEstudiantes = db.prepare(`
    SELECT estudiantes.id, estudiantes.nombre, estudiantes.carrera, estudiantes.semestre,
    GROUP_CONCAT(habilidades.nombre) AS habilidades FROM estudiantes
    LEFT JOIN estudiante_habilidades ON estudiantes.id = estudiante_habilidades.estudiante_id
    LEFT JOIN habilidades ON estudiante_habilidades.habilidad_id = habilidades.id
    WHERE estudiantes.nombre LIKE ? OR habilidades.nombre LIKE ?
    GROUP BY estudiantes.id
    `);
    const estudiantes = consultaBuscarEstudiantes.all(`%${terminoBusqueda}%`, `%${terminoBusqueda}%`);
    // convierte habilidades de texto a arreglo
    estudiantes.forEach(estudiante => {
        estudiante.habilidades = estudiante.habilidades
            ? estudiante.habilidades.split(",")
            : [];
    });
    respuesta.json(estudiantes);
});

// GET /api/estudiantes/:id
// regresa la informacion publica de un estudiante por su id
router.get("/:id", (req, respuesta) => {

    // req.params lee los valores que van dentro de la URL — el :id del endpoint
    const idEstudiante = req.params.id;

    // busca el estudiante — no incluye password por seguridad
    const consultaBuscarEstudiante = db.prepare(`
        SELECT id, nombre, email, carrera, semestre, descripcion, github, linkedin, telefono, cv_url 
        FROM estudiantes WHERE id = ?
    `);
    const estudiante = consultaBuscarEstudiante.get(idEstudiante);

    // si no existe manda error 404
    if (!estudiante) {
        return respuesta.status(404).json({ error: "Estudiante no encontrado" });
    }

    respuesta.json(estudiante);
});

// PUT /api/estudiantes/:id
// actualiza la informacion del perfil de un estudiante
// solo actualiza los campos que se mandaron, los demas se quedan igual
router.put("/:id", (req, respuesta) => {

    // lee el id de la URL
    const idEstudiante = req.params.id;

    // busca el estudiante actual para conservar sus datos si no se mandan todos
    const consultaBuscarEstudiante = db.prepare("SELECT * FROM estudiantes WHERE id = ?");
    const estudiante = consultaBuscarEstudiante.get(idEstudiante);

    // si no existe manda error 404
    if (!estudiante) {
        return respuesta.status(404).json({ error: "Estudiante no encontrado" });
    }

    // actualiza el estudiante con los nuevos datos
    // ?? significa "si lo que esta a la izquierda es null o undefined usa lo de la derecha"
    // asi si no se manda un campo se queda con el valor que ya tenia
    const consultaActualizarEstudiante = db.prepare(`
        UPDATE estudiantes SET nombre = ?, carrera = ?, semestre = ?, descripcion = ?, github = ?, linkedin = ?, telefono = ?, cv_url = ?  WHERE id = ?
    `);

    consultaActualizarEstudiante.run(
        req.body.nombre ?? estudiante.nombre,
        req.body.carrera ?? estudiante.carrera,
        req.body.semestre ?? estudiante.semestre,
        req.body.descripcion ?? estudiante.descripcion,
        req.body.github ?? estudiante.github,
        req.body.linkedin ?? estudiante.linkedin,
        req.body.telefono ?? estudiante.telefono,
        req.body.cv_url ?? estudiante.cv_url,
        idEstudiante
    );

    respuesta.json({ mensaje: "Perfil actualizado correctamente" });
});

// GET /api/estudiantes/:id/habilidades
// regresa todas las habilidades de un estudiante con su nivel y categoria
router.get("/:id/habilidades", (req, respuesta) => {

    const idEstudiante = req.params.id;

    // JOIN une las tablas para traer el nombre y categoria de cada habilidad
    const consultaHabilidadesEstudiante = db.prepare(`
        SELECT habilidades.id, habilidades.nombre, estudiante_habilidades.nivel, categorias.nombre AS categoria
        FROM estudiante_habilidades
        JOIN habilidades ON estudiante_habilidades.habilidad_id = habilidades.id
        JOIN categorias ON habilidades.categoria_id = categorias.id
        WHERE estudiante_habilidades.estudiante_id = ?
    `);
    const habilidades = consultaHabilidadesEstudiante.all(idEstudiante);

    respuesta.json(habilidades);
});

// POST /api/estudiantes/:id/habilidades
// agrega una habilidad al estudiante con su nivel de dominio
router.post("/:id/habilidades", (req, respuesta) => {

    const idEstudiante = req.params.id;
    const idHabilidad = req.body.habilidad_id;
    const nivel = req.body.nivel || "basico"; // si no se manda nivel usa basico por defecto

    // valida que se mando el id de la habilidad
    if (!idHabilidad) {
        return respuesta.status(400).json({ error: "Falta el id de la habilidad" });
    }

    // verifica que el estudiante exista
    const consultaBuscarEstudiante = db.prepare("SELECT id FROM estudiantes WHERE id = ?");
    const estudiante = consultaBuscarEstudiante.get(idEstudiante);

    if (!estudiante) {
        return respuesta.status(404).json({ error: "Estudiante no encontrado" });
    }

    // inserta la habilidad — INSERT OR IGNORE evita duplicados si ya la tiene
    const consultaAgregarHabilidad = db.prepare(`
        INSERT OR IGNORE INTO estudiante_habilidades (estudiante_id, habilidad_id, nivel) VALUES (?, ?, ?)
    `);
    consultaAgregarHabilidad.run(idEstudiante, idHabilidad, nivel);

    respuesta.status(201).json({ mensaje: "Habilidad agregada correctamente" });
});

// PUT /api/estudiantes/:id/habilidades/:idHabilidad
// actualiza el nivel de dominio de una habilidad del estudiante
router.put("/:id/habilidades/:idHabilidad", (req, respuesta) => {
    const idEstudiante = req.params.id;
    const idHabilidad = req.params.idHabilidad;
    const nivel = req.body.nivel;

    // valida que se mando el nivel
    if (!nivel) {
        return respuesta.status(400).json({ error: "Falta el nivel" });
    }

    // actualiza el nivel de la habilidad del estudiante
    const consultaActualizarNivel = db.prepare(`
        UPDATE estudiante_habilidades SET nivel = ? WHERE estudiante_id = ? AND habilidad_id = ?
    `);
    const resultado = consultaActualizarNivel.run(nivel, idEstudiante, idHabilidad);

    // changes indica cuantas filas se modificaron — si es 0 es porque no existia
    if (resultado.changes === 0) {
        return respuesta.status(404).json({ error: "Habilidad no encontrada para este estudiante" });
    }

    respuesta.json({ mensaje: "Nivel actualizado correctamente" });
});

// DELETE /api/estudiantes/:id/habilidades/:idHabilidad
// quita una habilidad del estudiante
router.delete("/:id/habilidades/:idHabilidad", (req, respuesta) => {
    const idEstudiante = req.params.id;
    const idHabilidad = req.params.idHabilidad;

    // elimina la relacion entre el estudiante y la habilidad
    const consultaEliminarHabilidad = db.prepare(`
        DELETE FROM estudiante_habilidades WHERE estudiante_id = ? AND habilidad_id = ?
    `);
    const resultado = consultaEliminarHabilidad.run(idEstudiante, idHabilidad);

    // si no se elimino nada es porque no existia
    if (resultado.changes === 0) {
        return respuesta.status(404).json({ error: "Habilidad no encontrada para este estudiante" });
    }

    respuesta.json({ mensaje: "Habilidad eliminada correctamente" });
});

// GET /api/estudiantes/:id/experiencias
// regresa todas las experiencias academicas de un estudiante
router.get("/:id/experiencias", (req, respuesta) => {
    const idEstudiante = req.params.id;

    const consultaExperienciasEstudiante = db.prepare(`
        SELECT * FROM experiencias WHERE estudiante_id = ?
    `);
    const experiencias = consultaExperienciasEstudiante.all(idEstudiante);

    respuesta.json(experiencias);
});

// POST /api/estudiantes/:id/experiencias
// agrega una experiencia academica al estudiante
router.post("/:id/experiencias", (req, respuesta) => {
    const idEstudiante = req.params.id;

    // lee los datos del cuerpo de la peticion
    const titulo = req.body.titulo;
    const institucion = req.body.institucion;
    const tipo = req.body.tipo;
    const fechaInicio = req.body.fecha_inicio;
    const fechaFin = req.body.fecha_fin || null; // null si la experiencia sigue en curso
    const descripcion = req.body.descripcion;

    // valida los campos obligatorios
    if (!titulo || !tipo) {
        return respuesta.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // verifica que el estudiante exista
    const consultaBuscarEstudiante = db.prepare("SELECT id FROM estudiantes WHERE id = ?");
    const estudiante = consultaBuscarEstudiante.get(idEstudiante);

    if (!estudiante) {
        return respuesta.status(404).json({ error: "Estudiante no encontrado" });
    }

    // inserta la experiencia en la base de datos
    const consultaAgregarExperiencia = db.prepare(`
        INSERT INTO experiencias (estudiante_id, titulo, institucion, tipo, fecha_inicio, fecha_fin, descripcion)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const resultado = consultaAgregarExperiencia.run(idEstudiante, titulo, institucion, tipo, fechaInicio, fechaFin, descripcion);

    respuesta.status(201).json({
        mensaje: "Experiencia agregada correctamente",
        id: resultado.lastInsertRowid
    });
});

// GET /api/estudiantes/:id/proyectos
// regresa todos los proyectos de un estudiante especifico
router.get("/:id/proyectos", (req, respuesta) => {
    const idEstudiante = req.params.id;

    const consultaProyectosEstudiante = db.prepare(`
        SELECT * FROM proyectos WHERE estudiante_id = ?
    `);
    const proyectos = consultaProyectosEstudiante.all(idEstudiante);

    respuesta.json(proyectos);
});

// exporta el router para usarlo en app.js
module.exports = router;