// funcion para iniciar sesion
function iniciarSesion() {
    // lee el correo y contraseña
    let correo = document.getElementById("correo").value;
    let contrasena = document.getElementById("contrasena").value;

    // checa que no esten vacios
    if (correo === "" || contrasena === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // busca el usuario por correo
    let indiceCorreos = JSON.parse(localStorage.getItem("indiceCorreos")) || {};
    let idUsuario = indiceCorreos[correo];// obtiene el id del usuario a partir del correo

    // si no existe el usuario, muestra un mensaje de error
    if (!idUsuario) {
        alert("Cuenta no existente. Por favor, regístrate primero.");
        return;
    }
    
    // obtiene el usuario a partir del id
    let usuario = JSON.parse(localStorage.getItem("usuario_" + idUsuario));
    
    // verifica la contraseña
    if (usuario.contrasena !== contrasena) {
        alert("Contraseña incorrecta. Inténtalo de nuevo.");
        return;
    }

    // guarda el id del usuario actual en localStorage para usarlo en otras paginas
    localStorage.setItem("usuarioActual", idUsuario);

    // te manda a la pagina de perfil
    window.location.href = "perfil.html";
}