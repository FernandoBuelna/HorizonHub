let API_URL = "http://localhost:3000/api";

let cacheEstudiantes = [];
let cacheProyectos = [];

async function obtenerEstudiantes() {
    // si ya existen en memoria los regresa
    if (cacheEstudiantes.length > 0) {
        return cacheEstudiantes;
    }

    try {
        // obtiene los estudiantes
        let respuesta = await fetch(`${API_URL}/estudiantes`);

        // si la respuesta no es ok lanza un error
        if (!respuesta.ok) {
            throw new Error("Error al obtener estudiantes");
        }

        // convierte la respuesta a json
        let estudiantes = await respuesta.json();
        // guarda en cache
        cacheEstudiantes = estudiantes;
        return estudiantes;
    } catch(error) {
        console.error(error);
        return [];
    }
}

// funcion para obtener todos los proyectos desde la api
async function obtenerProyectos() {
    // si ya existen en memoria los regresa
    if (cacheProyectos.length > 0) {
        return cacheProyectos;
    }

    try {
        // obtiene los proyectos
        let respuesta = await fetch(`${API_URL}/proyectos`);

        // si la respuesta no es ok lanza un error
        if (!respuesta.ok) {
            throw new Error("Error al obtener proyectos");
        }

        // convierte la respuesta a json
        let proyectos = await respuesta.json();
        // guarda en cache
        cacheProyectos = proyectos;
        return proyectos;

    } catch(error) {
        console.error(error);
        return [];
    }
}

// crea y regresa la tarjeta de un estudiante
function crearTarjetaEstudiante(usuario) {
    // toma las iniciales del nombre para el avatar
    let iniciales = usuario.nombre.split(" ")[0][0].toUpperCase();
    iniciales += usuario.nombre.split(" ").length > 1 ? usuario.nombre.split(" ")[1][0].toUpperCase() : "";
    let tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-estudiante");
    // crea la tarjeta del estudiante
    tarjeta.innerHTML = `
        <div class="tarjeta-etiqueta">
            <span class="etiqueta-estudiante">Estudiante</span>
        </div>
        <div class="tarjeta-imagen">
            <div class="avatar">${iniciales}</div>
        </div>
        <div class="tarjeta-nombre">
            <span class="nombre-tarjeta">${usuario.nombre}</span>
        </div>
        <div class="tarjeta-sub">
            <span class="sub-tarjeta">${usuario.carrera || "Carrera no especificada"}</span>
        </div>
        <div class="tarjeta-tags">
            <span class="tag">${usuario.semestre ? "Semestre " + usuario.semestre : "Semestre no especificado"}</span>
        </div>
    `;
    // al hacer click te manda al perfil publico del estudiante
    tarjeta.onclick = function() {
        window.location.href = "perfil-publico.html?id=" + usuario.id;
    };
    return tarjeta;
}

// crea la tarjeta de un proyecto
function crearTarjetaProyecto(proyecto) {
    let tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-proyecto");
    // crea la tarjeta del proyecto
    tarjeta.innerHTML = `
        <div class="tarjeta-etiqueta">
            <span class="etiqueta-proyecto">Proyecto</span>
        </div>
        <div class="tarjeta-nombre">
            <span class="nombre-tarjeta">${proyecto.nombre}</span>
        </div>
        <div class="tarjeta-sub">
            <span class="sub-tarjeta">${proyecto.descripcion}</span>
        </div>
        <div class="tarjeta-tags">
            ${(proyecto.tecnologias || []).map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
    `;

    // al hacer click te manda al perfil publico del estudiante que creo el proyecto
    tarjeta.onclick = function() {
        window.location.href = "perfil-publico.html?id=" + proyecto.estudiante_id;
    };

    return tarjeta;
}

// muestra los resultados en el contenedor o un mensaje si no hay
function mostrarResultados(resultados) {
    let contenedor = document.getElementById("contenedor-tarjetas");
    contenedor.innerHTML = "";

    // si no hay resultados muestra un mensaje
    if (resultados.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    // agrega cada tarjeta al contenedor
    resultados.forEach(tarjeta => contenedor.appendChild(tarjeta));
}

// busca estudiantes por nombre o habilidad
async function buscarEnEstudiantes(termino) {
    try {
        // busca estudiantes usando
        let respuesta = await fetch(`${API_URL}/estudiantes?q=${termino}`);

        if (!respuesta.ok) {
            throw new Error("Error al buscar estudiantes");
        }

        let estudiantes = await respuesta.json();

        // crea las tarjetas de los estudiantes encontrados
        let resultados = estudiantes.map(usuario =>
            crearTarjetaEstudiante(usuario)
        );
        mostrarResultados(resultados);
    } catch(error) {
        console.error(error);
    }
}

// busca proyectos por nombre o tecnologia
async function buscarEnProyectos(termino) {
    try {
        // busca proyectos
        let respuesta = await fetch(`${API_URL}/proyectos?q=${termino}`);

        if (!respuesta.ok) {
            throw new Error("Error al buscar proyectos");
        }

        let proyectos = await respuesta.json();

        // crea las tarjetas de los proyectos encontrados
        let resultados = proyectos.map(proyecto =>
            crearTarjetaProyecto(proyecto)
        );
        mostrarResultados(resultados);
    } catch(error) {
        console.error(error);
    }
}

// busca tecnologias y habilidades
async function buscarEnTecnologias(termino) {
    let resultados = [];
    try {
        // busca proyectos
        let respuestaProyectos = await fetch(`${API_URL}/proyectos?q=${termino}`);

        if (!respuestaProyectos.ok) {
            throw new Error("Error al buscar proyectos");
        }

        let proyectos = await respuestaProyectos.json();

        // busca en las tecnologias de cada proyecto
        proyectos.forEach(proyecto => {
            if ((proyecto.tecnologias || []).some(t =>
                t.toLowerCase().includes(termino)
            )) {
                resultados.push(crearTarjetaProyecto(proyecto));
            }
        });

        // busca estudiantes
        let respuestaEstudiantes = await fetch(`${API_URL}/estudiantes?q=${termino}`);

        if (!respuestaEstudiantes.ok) {
            throw new Error("Error al buscar estudiantes");
        }

        let estudiantes = await respuestaEstudiantes.json();

        // busca en las habilidades de cada estudiante
        estudiantes.forEach(usuario => {
            if ((usuario.habilidades || []).some(habilidad =>
                habilidad.toLowerCase().includes(termino)
            )) {
                resultados.push(crearTarjetaEstudiante(usuario));
            }
        });
        mostrarResultados(resultados);
    } catch(error) {
        console.error(error);
    }
}

// busca en todo
async function buscarEnTodo(termino) {
    let resultados = [];
    try {
        // estudiantes
        let respuestaEstudiantes = await fetch(`${API_URL}/estudiantes?q=${termino}`);

        if (!respuestaEstudiantes.ok) {
            throw new Error("Error al buscar estudiantes");
        }

        let estudiantes = await respuestaEstudiantes.json();

        // crea las tarjetas de los estudiantes encontrados
        estudiantes.forEach(usuario => {
            resultados.push(crearTarjetaEstudiante(usuario));
        });

        // proyectos
        let respuestaProyectos = await fetch(`${API_URL}/proyectos?q=${termino}`);

        if (!respuestaProyectos.ok) {
            throw new Error("Error al buscar proyectos");
        }

        let proyectos = await respuestaProyectos.json();

        // crea las tarjetas de los proyectos encontrados
        proyectos.forEach(proyecto => {
            resultados.push(crearTarjetaProyecto(proyecto));
        });
        mostrarResultados(resultados);
    } catch(error) {
        console.error(error);
    }
}

function buscar(busqueda) {
    let contenedor = document.getElementById("contenedor-tarjetas");

    // si no hay nada escrito muestra mensaje
    if (!busqueda) {
        contenedor.innerHTML = "<p>Escribe algo para buscar.</p>";
        return;
    }

    // toma los primeros dos caracteres para detectar el prefijo
    let prefijo = busqueda.slice(0, 2);

    // segun el prefijo llama a la funcion correspondiente
    switch (prefijo) {
        case "e/": // /e para estudiantes
            buscarEnEstudiantes(
                busqueda.slice(2).toLowerCase()
            );
            break;
        case "p/": // /p para proyectos
            buscarEnProyectos(
                busqueda.slice(2).toLowerCase()
            );
            break;
        case "t/": // /t para tecnologias y habilidades
            buscarEnTecnologias(
                busqueda.slice(2).toLowerCase()
            );
            break;
        default:
            // si no hay prefijo busca en todo usando el query completo
            buscarEnTodo(
                busqueda.toLowerCase()
            );
            break;
    }
}

// escucha el input en tiempo real y llama a buscar cada vez que cambia
document.getElementById("input-busqueda").addEventListener("input", function() {
    buscar(this.value.trim());
});