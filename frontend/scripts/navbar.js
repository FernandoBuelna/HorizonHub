// detecta en que pagina esta el usuario
let pagina = window.location.pathname.split("/").pop(); // toma la ruta, con split la divide por "/" y con pop toma el ultimo elemento que es el nombre del archivo

// funcion para cerrar sesion
function cerrarSesion() {
    localStorage.removeItem("usuarioActual"); // quita el usuario actual del localStorage
    window.location.href = "pagina-inicio.html"; // te manda a la pagina de inicio
}

// actualiza los botones del navbar segun si hay sesion y en que pagina esta
function actualizarNavbar() {
    let navBotones = document.getElementById("nav-botones");
    let usuarioActual = localStorage.getItem("usuarioActual");

    if (usuarioActual) {
        // hay sesion activa
        switch (pagina) {
        case "perfil.html":
        case "perfil-publico.html":
            navBotones.innerHTML = `
                <button type="button" class="boton-borde" onclick="compartirPerfil()">Compartir Perfil</button>
                <button type="button" class="boton-cancelar" onclick="cerrarSesion()">Cerrar Sesion</button>
            `;
            break;
        default:
            navBotones.innerHTML = `
                <a href="perfil.html" class="boton-solido">Ir al Perfil</a>
                <button type="button" class="boton-cancelar" onclick="cerrarSesion()">Cerrar Sesion</button>
            `;
            break;
        }
    } else {
        // no hay sesion activa
        switch (pagina) {
            case "login.html":
                // en login no muestra iniciar sesion
                navBotones.innerHTML = `
                    <a href="registro.html" class="boton-solido">Registrarse</a>
                `;
                break;
            case "registro.html":
                // en registro no muestra registrarse
                navBotones.innerHTML = `
                    <a href="login.html" class="boton-borde">Iniciar Sesion</a>
                `;
                break;
            default:
                // en el resto muestra los dos botones
                navBotones.innerHTML = `
                    <a href="login.html" class="boton-borde">Iniciar Sesion</a>
                    <a href="registro.html" class="boton-solido">Registrarse</a>
                `;
                break;
        }
    }
}

// ejecuta al cargar el DOM
document.addEventListener("DOMContentLoaded", function() {
    actualizarNavbar();
});

// funcion para compartir el perfil
function compartirPerfil() {
    if (pagina === "perfil-publico.html") {
        navigator.clipboard.writeText(window.location.href) // navigator.clipboard.writeText() es una funcion que copia el texto al portapapeles
        .then(() => alert("Enlace copiado al portapapeles."))
        .catch(() => alert("No se pudo copiar el enlace."));
        return;
    }

    let usuarioActual = localStorage.getItem("usuarioActual");

    let enlace = `${window.location.origin}/perfil-publico.html?id=${usuarioActual}`; // window.location.origin es la parte del dominio, puerto y protocolo de la URL actual

    navigator.clipboard.writeText(enlace)
    .then(() => alert("Enlace copiado al portapapeles."))
    .catch(() => alert("No se pudo copiar el enlace."));
}