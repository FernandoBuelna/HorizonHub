// funcion para cerrar sesion
function cerrarSesion() {
    localStorage.removeItem("usuarioActual"); // quita el usuario actual del localStorage
    window.location.href = "pagina-inicio.html"; // te manda a la pagina de inicio no loggeada
}

// funcion para cargar las tarjetas de estudiantes
function cargarEstudiantes() {
    // trae el contenedor de tarjetas
    let contenedor = document.getElementById("contenedor-tarjetas");
    contenedor.innerHTML = ""; // limpia el contenedor

    // lee cuantos usuarios hay registrados
    let totalUsuarios = parseInt(localStorage.getItem("idUsuario"));

    if (!totalUsuarios) {
        contenedor.innerHTML = "<p>No hay estudiantes registrados.</p>";
        return;
    }

    // recorre todos los usuarios
    for (let i = 1; i < totalUsuarios; i++) {

        // busca el usuario con ese id
        let usuario = JSON.parse(localStorage.getItem("usuario_" + i));

        // si no existe ese usuario lo salta
        if (!usuario) continue;

        // toma las iniciales del nombre igual que en el perfil
        let iniciales = usuario.nombre.split(" ")[0][0].toUpperCase();
        iniciales += usuario.nombre.split(" ").length > 1 ? usuario.nombre.split(" ")[1][0].toUpperCase() : "";

        // crea la tarjeta del estudiante
        let tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-estudiante");

        // le mete los datos del estudiante a la tarjeta
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

        // agrega la tarjeta al contenedor
        contenedor.appendChild(tarjeta);
    }
}

// carga los estudiantes al iniciar la pagina
cargarEstudiantes();