let API_URL = "http://localhost:3000/api";
// mezcla el arreglo aleatoriamente
function mezclarArreglos(arreglo) {
    arreglo.sort(() => Math.random() - 0.5);
    return arreglo;
}

// crea y regresa la tarjeta de un estudiante
function crearTarjetaEstudiante(usuario) {
    let iniciales = usuario.nombre.split(" ")[0][0].toUpperCase();
    iniciales += usuario.nombre.split(" ").length > 1 ? usuario.nombre.split(" ")[1][0].toUpperCase() : "";

    let tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-estudiante");
    //crea la tarjeta de cada estudiante
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

// crea y regresa la tarjeta de un proyecto
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
            <span class="sub-tarjeta">${proyecto.descripcion || ""}</span>
        </div>
        <div class="tarjeta-tags">
        </div>
    `;

    // obtiene las tecnologias del proyecto
    fetch(`${API_URL}/proyectos/${proyecto.id}/tecnologias`)
    .then(res => res.json())
    .then(tecnologias => {
        let contenedorTags = tarjeta.querySelector(".tarjeta-tags");

        // las mete en un span
        tecnologias.forEach(t => {
            let tag = document.createElement("span");
            tag.classList.add("tag");
            tag.textContent = t.nombre;
            contenedorTags.appendChild(tag);
        });
    });

    // al hacer click te manda al perfil publico del estudiante que hizo el proyecto
    tarjeta.onclick = function() {
        window.location.href = "perfil-publico.html?id=" + proyecto.estudiante_id;
    };

    return tarjeta;
}

// carga las tarjetas alternando bloques de 3 estudiantes y 3 proyectos
function cargarTarjetas() {
    let contenedor = document.getElementById("contenedor-tarjetas");

    // hace los dos fetch al mismo tiempo y espera a que terminen
    Promise.all([ // Promise.all para hacer ambos fetch al mismo tiempo
        fetch(`${API_URL}/estudiantes`).then(res => res.json()),
        fetch(`${API_URL}/proyectos`).then(res => res.json())
    ])
    .then(function(resultados) {
        let estudiantes = mezclarArreglos(resultados[0]);
        let proyectos = mezclarArreglos(resultados[1]);

        contenedor.innerHTML = "";

        // si no hay nada muestra mensaje
        if (!estudiantes.length && !proyectos.length) {
            contenedor.innerHTML = "<p>No hay contenido registrado.</p>";
            return;
        }

        // si no hay proyectos muestra solo estudiantes
        if (!proyectos.length) {
            estudiantes.forEach(u => contenedor.appendChild(crearTarjetaEstudiante(u)));
            return;
        }

        // si no hay estudiantes muestra solo proyectos
        if (!estudiantes.length) {
            proyectos.forEach(p => contenedor.appendChild(crearTarjetaProyecto(p)));
            return;
        }

        // calcula cuantas tarjetas mostrar en total
        let total = Math.max(estudiantes.length, proyectos.length) * 2;

        let contadorEstudiantes = 0;
        let contadorProyectos = 0;

        for (let i = 0; i < total; i++) {
            // cada 3 tarjetas alterna entre estudiantes y proyectos
            if (Math.floor(i / 3) % 2 === 0) {
                // bloque de estudiantes
                contenedor.appendChild(crearTarjetaEstudiante(estudiantes[contadorEstudiantes % estudiantes.length]));
                contadorEstudiantes++;
            } else {
                // bloque de proyectos
                contenedor.appendChild(crearTarjetaProyecto(proyectos[contadorProyectos % proyectos.length]));
                contadorProyectos++;
            }
        }
    })
    .catch(error => {
        contenedor.innerHTML = "<p>Error al cargar el contenido.</p>";
        console.log("Error:", error);
    });
}

cargarTarjetas();