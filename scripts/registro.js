const regexCorreo = /^a\d{8}@unisierra\.edu\.mx$/;// regex para validar el correo de la universidad
const regexContrasena = /^.{8,}$/;// regex para validar que la contraseña tenga al menos 8 caracteres

// funcion para registrar un nuevo usuario
function registrar() {
    // lee los datos del formulario
    let idUsuario = parseInt(localStorage.getItem("idUsuario") || "1");
    let nombre = document.getElementById("nombre").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let contrasena = document.getElementById("contrasena").value;
    let confirmarContrasena = document.getElementById("confirmarContrasena").value;

    // valida los datos
    if (nombre === "" || correo === "" || contrasena === "" || confirmarContrasena === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // valida el formato del correo y la contraseña
    if (!regexCorreo.test(correo)) {
        alert("Por favor, introduce un correo válido.");
        return;
    }

    if (!regexContrasena.test(contrasena)) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    // verifica que el correo no este registrado y que las contraseñas coincidan
    let indiceCorreos = JSON.parse(localStorage.getItem("indiceCorreos")) || {};
    let usuarioExistente = indiceCorreos[correo];

    if (usuarioExistente) {
        alert("Ya existe una cuenta con este correo. Por favor, inicia sesión.");
        return;
    }

    if (contrasena !== confirmarContrasena) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // crea un nuevo usuario
    let usuario = {
        id: idUsuario,
        nombre: nombre,
        correo: correo,
        contrasena: contrasena
    };

    // guarda el usuario en localStorage
    localStorage.setItem("usuario_" + idUsuario, JSON.stringify(usuario));// guarda el usuario con una clave unica basada en su id
    indiceCorreos[correo] = idUsuario;// actualiza el indice de correos para poder buscar al usuario por su correo
    localStorage.setItem("indiceCorreos", JSON.stringify(indiceCorreos));// guarda el indice de correos actualizado
    localStorage.setItem("usuarioActual", idUsuario);// guarda el id del usuario actual en localStorage para usarlo en otras paginas

    localStorage.setItem("idUsuario", idUsuario + 1);// incrementa el id para el siguiente usuario

    window.location.href = "perfil.html"; // te manda a la pagina de perfil
}