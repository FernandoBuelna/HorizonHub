let API_URL = "http://localhost:3000/api";
const regexCorreo = /^a\d{8}@unisierra\.edu\.mx$/;
const regexContrasena = /^.{8,}$/;

// registra un nuevo usuario
function registrar() {
    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("correo").value.trim();
    let password = document.getElementById("contrasena").value;
    let confirmarPassword = document.getElementById("confirmarContrasena").value;

    // validaciones — estas se quedan igual
    if (nombre === "" || email === "" || password === "" || confirmarPassword === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    if (!regexCorreo.test(email)) {
        alert("Por favor, introduce un correo valido.");
        return;
    }

    if (!regexContrasena.test(password)) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    if (password !== confirmarPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // manda los datos al servidor en lugar de guardarlos en localStorage
    fetch(`${API_URL}/estudiantes/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre, email: email, password: password })
    })
    .then(respuesta => respuesta.json()) // convierte la respuesta del servidor a objeto
    .then(datos => {
        if (datos.error) {
            // si el servidor mando un error lo muestra
            alert(datos.error);
            return;
        }
        // si todo salio bien guarda el id en localStorage y manda al perfil
        localStorage.setItem("usuarioActual", datos.id);
        window.location.href = "perfil.html";
    })
    .catch(error => {
        // si no se puede conectar al servidor
        alert("Error al conectar con el servidor.");
    });
}