let tecnologiasSeleccionadas = []; // arreglo de tecnologias de cada proyecto
//variables para saber que se va a editar
let proyectoEditarId = null;
let editarHabilidadId = null;
let editarExperienciaId = null;

// funcion que carga los datos del usuario loggeado en el perfil
function cargarPerfil() {
    // trae el id del usuario loggeado
    let usuarioActual = localStorage.getItem("usuarioActual"); // detecta el usuario loggeado
    
    // si no hay usuario loggeado retorna
    if (!usuarioActual) {
        alert("No se ha encontrado un usuario activo. Por favor, inicia sesión.");
        return;
    }

    // trae el usuario completo del localStorage    
    let usuario = localStorage.getItem("usuario_" + usuarioActual);

    // si el usuario no existe se retorna
    if (!usuario) {
        alert("No se ha encontrado información del usuario. Por favor, inicia sesión.");
        return;
    }

    // convierte el usuario a objeto
    usuario = JSON.parse(usuario);

    // elementos del perfil
    let perfilAvatar = document.getElementById("perfil-avatar");
    let perfilNombre = document.getElementById("perfil-nombre");
    let perfilCarrera = document.getElementById("perfil-carrera");
    let perfilSemestre = document.getElementById("perfil-semestre");

    //toma ls iniciales de las primeras dos palabras del nombre
    let iniciales = usuario.nombre.split(" ")[0][0].toUpperCase(); // toma la primera letra de la primera palabra del nombre, el primer [0] es para tomar la primera palabra, el segundo [0] es para tomar la primera letra de esa palabra
    iniciales += usuario.nombre.split(" ").length > 1 ? usuario.nombre.split(" ")[1][0].toUpperCase() : ""; // si el nombre tiene mas de una palabra, toma la primera letra de la segunda palabra, si no tiene mas de una palabra, no agrega nada

    // carga los datos al perfil
    perfilAvatar.textContent = iniciales;
    perfilNombre.textContent = usuario.nombre;
    perfilCarrera.textContent = usuario.carrera || "Carrera no especificada";
    perfilSemestre.textContent = usuario.semestre ? `Semestre ${usuario.semestre}` : "Semestre no especificado";
    
    // carga las secciones
    cargarProyectos();
    cargarHabilidades();
    cargarExperiencias();
}

// qquita al usuario loggeado y te manda a la pagina de inicio no loggeada
function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    // redirige a la pagina de inicio
    window.location.href = "pagina-inicio.html";
}

// cambiar de seccione con el sidebar
function navegarSeciones() {
    // selecciona todos los items del sidebar
    let items = document.querySelectorAll(".sidebar-item");

    items.forEach(function(item) {
        // cuando se hace click en alguna de las secciones del sidebar
        item.addEventListener("click", function() {
            //oculto todos los elementos
            items.forEach(i => i.classList.remove("activo"));

            //mostrar el que se clickeo
            this.classList.add("activo");
            // ve cual es el que se clickeo
            let seleccion = this.getAttribute("data-seccion");

            // oculta todas las secciones
            document.getElementById("seccion-proyectos").classList.add("oculto");
            document.getElementById("seccion-habilidades").classList.add("oculto");
            document.getElementById("seccion-experiencias").classList.add("oculto");
            // muestra la seccion clickeada
            document.getElementById(`seccion-${seleccion}`).classList.remove("oculto");
        });
    });
    // carga los proyectos si hay
    cargarProyectos();
}

// abre el modal de editar perfil y carga los datos del usuario loggeado
function abrirEditarPerfil() {
    let usuarioActual = localStorage.getItem("usuarioActual");
    let usuario = JSON.parse(localStorage.getItem("usuario_" + usuarioActual));
    document.getElementById("editar-nombre").value = usuario.nombre;
    document.getElementById("editar-carrera").value = usuario.carrera || "";
    document.getElementById("editar-semestre").value = usuario.semestre || "";
    document.getElementById("editar-descripcion").value = usuario.descripcion || "";
    document.getElementById("modal-editar-perfil").classList.remove("oculto");
}

// cierra el modal de editar perfil
function cerrarModalEditarPerfil() {
    document.getElementById("modal-editar-perfil").classList.add("oculto");
}

// guarda los cambios y recarga el perfil
function guardarEditarPerfil() {
    // trae el usuario loggeado
    let usuarioActual = localStorage.getItem("usuarioActual");
    let usuario = JSON.parse(localStorage.getItem("usuario_" + usuarioActual));
    // agarra los datos del formulario
    let nombre = document.getElementById("editar-nombre").value;
    let carrera = document.getElementById("editar-carrera").value;
    let semestre = document.getElementById("editar-semestre").value;
    let descripcion = document.getElementById("editar-descripcion").value || "";

    // revisa que no esten vacios los campos obligatorios
    if (nombre === "" || carrera === "" || semestre  === "") {
        alert("Ingrese todos los datos obligatorios");
        return;
    }

    // crea un nuevo usuario con los datos nuevos
    let usuarioEditar = {
        id: usuario.id,
        nombre: nombre,
        correo: usuario.correo,
        contrasena: usuario.contrasena,
        carrera: carrera,
        semestre: semestre,
        descripcion: descripcion
    };

    // guarda el nuevo usuario con la clave del usuario loggeado
    localStorage.setItem("usuario_" + usuarioActual, JSON.stringify(usuarioEditar));
    // cierra el modal y recarga el perfil
    cerrarModalEditarPerfil();
    cargarPerfil();
}