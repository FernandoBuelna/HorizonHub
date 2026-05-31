const express = require("express");
const app = express();
const puerto = 3000;
const cors = require("cors");

// permite que express lea el cuerpo de las peticiones en formato JSON
app.use(express.json());
app.use(cors());

const ruta = require("path");

app.use(express.static(ruta.join(__dirname, "../frontend")));

// importa las rutas de cada modulo
const rutasEstudiantes = require("./routes/estudiantes");
const rutasProyectos = require("./routes/proyectos");
const rutasHabilidades = require("./routes/habilidades");
const rutasExperiencias = require("./routes/experiencias");
const rutasTecnologias = require("./routes/tecnologias");

// ruta de prueba
app.get("/", (req, respuesta) => {
    respuesta.json({ mensaje: "HorizonHub API funcionando" });
});

// registra las rutas
app.use("/api/estudiantes", rutasEstudiantes);
app.use("/api/proyectos", rutasProyectos);
app.use("/api/habilidades", rutasHabilidades);
app.use("/api/experiencias", rutasExperiencias);
app.use("/api/tecnologias", rutasTecnologias);

// inicia el servidor en el puerto definido
app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});