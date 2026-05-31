let API_URL = "http://localhost:3000/api";

// funcioon para iniciar sesion, verificando las credenciales
function iniciarSesion() {
    let email = document.getElementById("correo").value;
    let password = document.getElementById("contrasena").value;

    // valida que no esten vacios
    if (email === "" || password === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // manda los datos al servidor para verificar las credenciales
    fetch(`${API_URL}/estudiantes/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(respuesta => respuesta.json()) // convierte la respuesta a objeto
    .then(datos => {
        if (datos.error) {
            // si el servidor mando un error lo muestra
            alert(datos.error);
            return;
        }
        // guarda el id del usuario en localStorage y manda al perfil
        localStorage.setItem("usuarioActual", datos.id);
        window.location.href = "perfil.html";
    })
    .catch(error => {
        alert("Error al conectar con el servidor.");
    });
}