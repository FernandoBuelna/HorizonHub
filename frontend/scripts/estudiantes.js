// crea y regresa la tarjeta de un estudiante
function crearTarjetaEstudiante(usuario) {
    let iniciales = usuario.nombre.split(" ")[0][0].toUpperCase();

    iniciales += usuario.nombre.split(" ").length > 1 ? usuario.nombre.split(" ")[1][0].toUpperCase() : "";
    let tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-estudiante");

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
            <span class="sub-tarjeta">
                ${usuario.carrera || "Carrera no especificada"}
            </span>
        </div>
        <div class="tarjeta-tags">
            <span class="tag">
                ${usuario.semestre ? "Semestre " + usuario.semestre : "Semestre no especificado"}
            </span>
        </div>
    `;

    // manda al perfil publico
    tarjeta.onclick = function () {
        window.location.href = "perfil-publico.html?id=" + usuario.id;
    };
    return tarjeta;
}

// carga todos los estudiantes desde la API
async function cargarEstudiantes() {
    let contenedor = document.getElementById("contenedor-tarjetas");
    contenedor.innerHTML = "";
    try {
        // pide estudiantes al backend
        let respuesta = await fetch(`http://localhost:3000/api/estudiantes`);
        let estudiantes = await respuesta.json();

        // si no hay estudiantes
        if (!estudiantes.length) {
            contenedor.innerHTML = "<p>No hay estudiantes registrados.</p>";
            return;
        }

        // agrega tarjetas
        estudiantes.forEach(usuario => {
            contenedor.appendChild(crearTarjetaEstudiante(usuario));
        });

    } catch (error) {
        contenedor.innerHTML = "<p>Error al cargar estudiantes.</p>";
    }
}

// inicia la carga
cargarEstudiantes();