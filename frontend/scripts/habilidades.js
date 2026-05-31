let habilidadesCargadas = [];

// funcion para cargar el catalogo de habilidades en el select
function cargarCatalogoHabilidades() {
    fetch(`${API_URL}/habilidades`)
    .then(res => res.json())
    .then(habilidades => {
        let select = document.getElementById("habilidad-nombre");

        // limpia el select antes de llenarlo
        select.innerHTML = '<option value="">Selecciona una habilidad...</option>';

        // recorre las habilidades y crea una opcion por cada una
        habilidades.forEach(habilidad => {
            let opcion = document.createElement("option");
            opcion.value = habilidad.id; // el id es lo que se manda a la api
            opcion.textContent = habilidad.nombre; // el nombre es lo que ve el usuario
            select.appendChild(opcion);
        });
    })
    .catch(error => {
        alert("Error al cargar las habilidades.");
    });
}

// funcion para abrir el modal de agregar habilidades
function agregarHabilidad() {
    // limpia los campos
    document.getElementById("habilidad-nombre").value = "";
    document.getElementById("habilidad-nivel").value = "";
    // carga el catalogo de habilidades
    cargarCatalogoHabilidades();
    // muestra el modal
    document.getElementById("modal-habilidad").classList.remove("oculto");
}

// funcion que cierra el modal
function cerrarModalHabilidad() {
    document.getElementById("modal-habilidad").classList.add("oculto");
}

// funcion para guardar una habilidad
function guardarHabilidad() {
    let idHabilidad = document.getElementById("habilidad-nombre").value;
    let nivelHabilidad = document.getElementById("habilidad-nivel").value;
    let usuarioActual = localStorage.getItem("usuarioActual");

    // modo edicion — solo valida el nivel, el select de habilidad no aplica
    if (editarHabilidadId !== null) {
        if (nivelHabilidad === "") {
            alert("Por favor, selecciona un nivel.");
            return;
        }

        // fetch para guardar la habilidad editada
        fetch(`${API_URL}/estudiantes/${usuarioActual}/habilidades/${editarHabilidadId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nivel: nivelHabilidad })
        })
        .then(res => res.json())
        .then(datos => {
            if (datos.error) {
                alert(datos.error);
                return;
            }
            editarHabilidadId = null;
            cerrarModalHabilidad();
            cargarHabilidades();
        })
        .catch(error => {
            alert("Error al conectar con el servidor.");
        });
        return;
    }

    // modo crear — valida ambos campos
    if (idHabilidad === "" || nivelHabilidad === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // fetch para guardar la nueva habilidad
    fetch(`${API_URL}/estudiantes/${usuarioActual}/habilidades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habilidad_id: idHabilidad, nivel: nivelHabilidad })
    })
    .then(res => res.json())
    .then(datos => {
        if (datos.error) {
            alert(datos.error);
            return;
        }
        cerrarModalHabilidad();
        cargarHabilidades();
    })
    .catch(error => {
        alert("Error al conectar con el servidor.");
    });
}

// funcion para cargar las habilidades del estudiante
function cargarHabilidades() {
    let usuarioActual = localStorage.getItem("usuarioActual");
    if (!usuarioActual) return;

    // fetch para obtener las habilidades del estudiante
    fetch(`${API_URL}/estudiantes/${usuarioActual}/habilidades`)
    .then(res => res.json())
    .then(habilidades => {
        habilidadesCargadas = habilidades;

        let contenedor = document.getElementById("lista-habilidades");
        contenedor.innerHTML = "";

        // si el estudiante no tiene habilidades, muestra un mensaje
        if (habilidades.length === 0) {
            contenedor.innerHTML = "<p class='mensaje-vacio'>Todavia no tienes habilidades.</p>";
            return;
        }

        // crea las tarjetas de habilidades
        habilidades.forEach(habilidad => {
            let card = document.createElement("div");
            card.classList.add("habilidad-card");
            card.innerHTML = `
                <h4>${habilidad.nombre}</h4>
                <p>Nivel: ${habilidad.nivel}</p>
                <div class="proyecto-card-botones">
                <button type="button" class="btn-editar" onclick="editarHabilidad(${habilidad.id})">✎ Editar</button>
                <button type="button" class="btn-eliminar" onclick="eliminarHabilidad(${habilidad.id})">🗑 Eliminar</button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    })
    .catch(error => {
        console.log("Error al cargar habilidades:", error);
    });
}

// funcion para eliminar una habilidad
function eliminarHabilidad(id) {
    if (!confirm("¿Eliminar habilidad?")) {
        return;
    }
    let usuarioActual = localStorage.getItem("usuarioActual");

    // fetch para eliminar la habilidad en base al id
    fetch(`${API_URL}/estudiantes/${usuarioActual}/habilidades/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(datos => {
        if (datos.error) {
            alert(datos.error);
            return;
        }
        cargarHabilidades();
    })
    .catch(error => {
        alert("Error al conectar con el servidor.");
    });
}

// funcion para editar una habilidad
function editarHabilidad(id) {
    let habilidad = habilidadesCargadas.find(h => h.id === id);
    if (!habilidad) return;

    cargarCatalogoHabilidades();
    document.getElementById("habilidad-nivel").value = habilidad.nivel;
    document.getElementById("modal-habilidad").classList.remove("oculto");
    editarHabilidadId = id;
}
