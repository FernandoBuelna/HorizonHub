let API_URL = "http://localhost:3000/api";
let tecnologiasSeleccionadas = []; // arreglo de tecnologias de cada proyecto
//variables para saber que se va a editar
let proyectoEditarId = null;
let editarHabilidadId = null;
let editarExperienciaId = null;
let seccionActiva = "proyectos"; // seccion que se esta mostrando actualmente

//regex
const regexGithub = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/?$/; //regex para el github del usuario
const regexLinkedin = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]+\/?$/; //regex para el linkedin del usuario

// funcion que carga los datos del usuario loggeado en el perfil
function cargarPerfil() {
    // trae el id del usuario loggeado
    let usuarioActual = localStorage.getItem("usuarioActual");
    
    // si no hay usuario loggeado retorna
    if (!usuarioActual) {
        alert("Por favor, inicia sesion.");
        window.location.href = "login.html";
        return;
    }

    // pide los datos del usuario al servidor usando su id
    fetch(`${API_URL}/estudiantes/${usuarioActual}`)
    .then(respuesta => respuesta.json())
    .then(usuario => {

        // si el servidor mando un error retorna
        if (usuario.error) {
            alert("No se ha encontrado informacion del usuario. Por favor, inicia sesion.");
            return;
        }

        // elementos del perfil
        let perfilAvatar = document.getElementById("perfil-avatar");
        let perfilNombre = document.getElementById("perfil-nombre");
        let perfilCarrera = document.getElementById("perfil-carrera");
        let perfilSemestre = document.getElementById("perfil-semestre");
        let perfilDescripcion = document.getElementById("perfil-descripcion");
        let perfilGithub = document.getElementById("perfil-github");
        let perfilLinkedin = document.getElementById("perfil-linkedin");
        let perfilTelefono = document.getElementById("perfil-telefono");

        // toma las iniciales de las primeras dos palabras del nombre
        let iniciales = usuario.nombre.split(" ")[0][0].toUpperCase();
        iniciales += usuario.nombre.split(" ").length > 1 ? usuario.nombre.split(" ")[1][0].toUpperCase() : "";

        // carga los datos al perfil
        perfilAvatar.textContent = iniciales;
        perfilNombre.textContent = usuario.nombre;

        perfilCarrera.textContent = usuario.carrera || "Carrera no especificada";
        perfilCarrera.classList.toggle("oculto", !usuario.carrera);

        perfilSemestre.textContent = usuario.semestre ? `Semestre ${usuario.semestre}` : "Semestre no especificado";
        perfilSemestre.classList.toggle("oculto", !usuario.semestre);

        perfilDescripcion.textContent = usuario.descripcion || "";
        perfilDescripcion.classList.toggle("oculto", !usuario.descripcion);

        // si el usuario tiene github o linkedin los muestra, si no los oculta
        if (usuario.github) {
            perfilGithub.textContent = "GitHub";
            perfilGithub.href = usuario.github;
            perfilGithub.classList.remove("oculto");
        } else {
            perfilGithub.classList.add("oculto");
        }

        if (usuario.linkedin) {
            perfilLinkedin.textContent = "LinkedIn";
            perfilLinkedin.href = usuario.linkedin;
            perfilLinkedin.classList.remove("oculto");
        } else {
            perfilLinkedin.classList.add("oculto");
        }

        perfilTelefono.textContent = usuario.telefono || "";
        perfilTelefono.classList.toggle("oculto", !usuario.telefono);

        // si el usuario tiene cv muestra el boton para ir al url, si no lo oculta
        let btnCv = document.getElementById("btn-cv");
        if (usuario.cv_url) {
            btnCv.href = usuario.cv_url;
            btnCv.classList.remove("oculto");
        } else {
            btnCv.classList.add("oculto");
        }

        // carga solo la seccion activa
        if (seccionActiva === "proyectos") cargarProyectos();
        if (seccionActiva === "habilidades") cargarHabilidades();
        if (seccionActiva === "experiencias") cargarExperiencias();
    })
    .catch(error => {
        //si no se pudo conectar con el servidor muestra un mensaje de error
        alert("Error al conectar con el servidor.");
    });
}

// funcion para cambiar entre las secciones del perfil (proyectos, habilidades y experiencias)
function navegarSecciones() {
    //toma todos los items del sidebar
    let items = document.querySelectorAll(".sidebar-item");

    items.forEach(function(item) {
        // agrega un evento de click a cada item
        item.addEventListener("click", function(event) {
            items.forEach(i => i.classList.remove("activo"));
            // agrega la clase activo al item seleccionado y muestra su seccion correspondiente, ademas de cargar los datos de esa seccion
            this.classList.add("activo");
            seccionActiva = this.getAttribute("data-seccion");

            // oculta todas las secciones y muestra solo la seleccionada
            document.getElementById("seccion-proyectos").classList.add("oculto");
            document.getElementById("seccion-habilidades").classList.add("oculto");
            document.getElementById("seccion-experiencias").classList.add("oculto");
            document.getElementById(`seccion-${seccionActiva}`).classList.remove("oculto");

            // carga los datos de la seccion seleccionada
            if (seccionActiva === "proyectos") cargarProyectos();
            if (seccionActiva === "habilidades") cargarHabilidades();
            if (seccionActiva === "experiencias") cargarExperiencias();
        });
    });
}

// abre el modal de editar perfil y carga los datos del usuario loggeado
function abrirEditarPerfil() {
    let usuarioActual = localStorage.getItem("usuarioActual");

    // pide los datos actuales del usuario al servidor
    fetch(`${API_URL}/estudiantes/${usuarioActual}`)
    .then(respuesta => respuesta.json())
    .then(usuario => {
        document.getElementById("editar-nombre").value = usuario.nombre || "";
        document.getElementById("editar-carrera").value = usuario.carrera || "";
        document.getElementById("editar-semestre").value = usuario.semestre || "";
        document.getElementById("editar-descripcion").value = usuario.descripcion || "";
        document.getElementById("modal-editar-perfil").classList.remove("oculto");
        document.getElementById("editar-github").value = usuario.github || "";
        document.getElementById("editar-linkedin").value = usuario.linkedin || "";
        document.getElementById("editar-telefono").value = usuario.telefono || "";
        document.getElementById("editar-cv").value = usuario.cv_url || "";
    })
    .catch(error => {
        alert("Error al conectar con el servidor.");
    });
}

// cierra el modal de editar perfil
function cerrarModalEditarPerfil() {
    document.getElementById("modal-editar-perfil").classList.add("oculto");
}

// guarda los cambios del perfil y recarga
function guardarEditarPerfil() {
    let usuarioActual = localStorage.getItem("usuarioActual");
    let nombre = document.getElementById("editar-nombre").value;
    let carrera = document.getElementById("editar-carrera").value;
    let semestre = document.getElementById("editar-semestre").value;
    let descripcion = document.getElementById("editar-descripcion").value || "";
    let github = document.getElementById("editar-github").value || "";
    let linkedin = document.getElementById("editar-linkedin").value || "";
    let telefono = document.getElementById("editar-telefono").value || "";
    let cv = document.getElementById("editar-cv").value || "";

    // revisa que no esten vacios los campos obligatorios
    if (nombre === "" || carrera === "" || semestre === "") {
        alert("Ingrese todos los datos obligatorios");
        return;
    }

    // revisa que sea una carrera medianamente valida
    if (carrera.trim().length < 5) {
        alert("Ingrese una carrera valida");
        return;
    }

    // revisa que el semestre sea un numero entre 1 y 12
    if (semestre < 1 || semestre > 8) {
        alert("El semestre debe ser un numero entre 1 y 8");
        return;
    }

    // revisa que el github sea una url valida
    if (github && !regexGithub.test(github)) {
        alert("Ingrese un perfil de GitHub valido");
        return;
    }

    // revisa que el linkedin sea una url valida
    if (linkedin && !regexLinkedin.test(linkedin)) {
        alert("Ingrese un perfil de LinkedIn valido");
        return;
    }

    // revisa que el telefono tenga 10 digitos
    if (telefono && !/^\d{10}$/.test(telefono)) {
        alert("El telefono debe tener 10 digitos");
        return;
    }

    // revisa que la descripcion no tenga mas de 150 caracteres
    if (descripcion.length > 150) {
    alert("La descripcion no puede superar los 150 caracteres");
    return;
    }

    // manda los datos actualizados al servidor
    fetch(`${API_URL}/estudiantes/${usuarioActual}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }, // content type es para decirle al servidor que se esta mandando un json, por eso application/json que es el tipo de dato json
        body: JSON.stringify({nombre: nombre, carrera: carrera, semestre: semestre, descripcion: descripcion, github: github, linkedin: linkedin, telefono: telefono, cv_url: cv})
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.error) {
            alert(datos.error);
            return;
        }
        // cierra el modal y recarga el perfil
        cerrarModalEditarPerfil();
        cargarPerfil();
    })
    .catch(error => {
        alert("Error al conectar con el servidor.");
    });
}

//Carga el perfil al abrir la pagina
document.addEventListener("DOMContentLoaded", function() {
    cargarPerfil();
    navegarSecciones();
});