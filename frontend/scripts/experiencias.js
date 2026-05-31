let experienciasCargadas = [];

// funcion para abrir el modal de agregar experiencia
function agregarExperiencia() {
    // limpia los campos
    document.getElementById("experiencia-nombre").value = "";
    document.getElementById("experiencia-institucion").value = "";
    document.getElementById("experiencia-tipo").value = "";
    document.getElementById("experiencia-inicio").value = "";
    document.getElementById("experiencia-fin").value = "";
    document.getElementById("experiencia-descripcion").value = "";
    // muestra el modal
    document.getElementById("modal-experiencia").classList.remove("oculto");
}

// cierra el modal
function cerrarModalExperiencia() {
    document.getElementById("modal-experiencia").classList.add("oculto");
}

// funcion para guardar una experiencia
function guardarExperiencia() {
    let usuarioActual = localStorage.getItem("usuarioActual");

    // toma los valores de los campos del modal
    let titulo = document.getElementById("experiencia-nombre").value.trim();
    let institucion = document.getElementById("experiencia-institucion").value.trim();
    let tipo = document.getElementById("experiencia-tipo").value;
    let fechaInicio = document.getElementById("experiencia-inicio").value;
    let fechaFin = document.getElementById("experiencia-fin").value || null; // null si sigue en curso
    let descripcion = document.getElementById("experiencia-descripcion").value.trim();

    // revisa que los campos obligatorios no esten vacios
    if (titulo === "" || tipo === "" || fechaInicio === "") {
        alert("Por favor, completa los campos obligatorios.");
        return;
    }

    // fetch para editar experiencia
    if (editarExperienciaId !== null) {
        fetch(`${API_URL}/experiencias/` + editarExperienciaId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo: titulo, institucion: institucion, tipo: tipo, fecha_inicio: fechaInicio, fecha_fin: fechaFin, descripcion: descripcion })
        })
        .then(res => res.json())
        .then(datos => {
            if (datos.error) {
                alert(datos.error);
                return;
            }
            editarExperienciaId = null;
            cerrarModalExperiencia();
            cargarExperiencias();
        })
        .catch(error => {
            alert("Error al conectar con el servidor.");
        });
        return;
    }

    // fetch para crear una nueva experiencia
    fetch(`${API_URL}/estudiantes/${usuarioActual}/experiencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: titulo, institucion: institucion, tipo: tipo, fecha_inicio: fechaInicio, fecha_fin: fechaFin, descripcion: descripcion })
    })
    .then(res => res.json())
    .then(datos => {
        if (datos.error) {
            alert(datos.error);
            return;
        }
        cerrarModalExperiencia();
        cargarExperiencias();
    })
    .catch(error => {
        alert("Error al conectar con el servidor.");
    });
}

// funcion para cargar las experiencias del estudiante
function cargarExperiencias() {
    let usuarioActual = localStorage.getItem("usuarioActual");
    if (!usuarioActual) return;

    // fetch para obtener las experiencias del estudiante
    fetch(`${API_URL}/estudiantes/${usuarioActual}/experiencias`)
    .then(res => res.json())
    .then(experiencias => {
        experienciasCargadas = experiencias;

        let contenedor = document.getElementById("lista-experiencias");
        contenedor.innerHTML = "";

        // si no hay experiencias, muestra un mensaje
        if (experiencias.length === 0) {
            contenedor.innerHTML = "<p class='mensaje-vacio'>Todavia no tienes experiencias.</p>";
            return;
        }

        // crea una tarjeta para cada experiencia y la agrega al contenedor
        experiencias.forEach(experiencia => {
            let card = document.createElement("div");
            card.classList.add("experiencia-card");
            card.innerHTML = `
                <h4>${experiencia.titulo}</h4>
                <p>Institucion: ${experiencia.institucion || "No especificada"}</p>
                <p>Tipo: ${experiencia.tipo}</p>
                <p>Fecha inicio: ${experiencia.fecha_inicio || "No especificada"}, Fecha fin: ${experiencia.fecha_fin || "En curso"}</p>
                <p>Descripcion: ${experiencia.descripcion || "Sin descripcion"}</p>
                <div class="proyecto-card-botones">
                <button type="button" class="btn-editar" onclick="editarExperiencia(${experiencia.id})">✎ Editar</button>
                <button type="button" class="btn-eliminar" onclick="eliminarExperiencia(${experiencia.id})">🗑 Eliminar</button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    })
    .catch(error => {
        console.log("Error al cargar experiencias:", error);
    });
}

// funcion para eliminar una experiencia
function eliminarExperiencia(id) {
    if (!confirm("¿Eliminar experiencia?")) {
        return;
    }

    // fetch para eliminar experiencia
    fetch(`${API_URL}/experiencias/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(datos => {
        if (datos.error) {
            alert(datos.error);
            return;
        }
        cargarExperiencias();
    })
    .catch(error => {
        alert("Error al conectar con el servidor.");
    });
}

// funcion para editar una experiencia
function editarExperiencia(id) {
    let experiencia = experienciasCargadas.find(e => e.id === id);
    if (!experiencia) return;

    // llena los campos del modal con los datos de la experiencia a editar
    document.getElementById("experiencia-nombre").value = experiencia.titulo || "";
    document.getElementById("experiencia-institucion").value = experiencia.institucion || "";
    document.getElementById("experiencia-tipo").value = experiencia.tipo || "";
    document.getElementById("experiencia-inicio").value = experiencia.fecha_inicio || "";
    document.getElementById("experiencia-fin").value = experiencia.fecha_fin || "";
    document.getElementById("experiencia-descripcion").value = experiencia.descripcion || "";
    document.getElementById("modal-experiencia").classList.remove("oculto");
    editarExperienciaId = id;
}
