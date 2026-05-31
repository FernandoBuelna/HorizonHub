const regexRepositorio =/^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/; //regex para validar repositorios de github

// funcion para cargar las tecnologias del catalogo en el select
function cargarCatalogoTecnologias() {
    // fetch para obtener las tecnologias del catalogo y llenarlas en el select del modal de proyectos
    fetch(`${API_URL}/tecnologias`)
    .then(res => res.json())
    .then(tecnologias => {
        let select = document.getElementById("proyecto-tecnologias");

        // limpia el select antes de llenarlo
        select.innerHTML = '<option value="">Selecciona una tecnologia...</option>';

        // recorre las tecnologias y crea una opcion por cada una
        // usa el id como value para mandarlo a la api
        tecnologias.forEach(tecnologia => {
            let opcion = document.createElement("option");
            opcion.value = tecnologia.id; // el id es lo que se manda a la api
            opcion.textContent = tecnologia.nombre; // el nombre es lo que ve el usuario
            opcion.setAttribute("data-nombre", tecnologia.nombre); // guarda el nombre para mostrarlo en el tag
            select.appendChild(opcion);
        });
    })
    .catch(error => {
        alert("Error al cargar las tecnologias.");
    });
}

// funcion para abrir el modal de proyectos y limpiar los campos
function agregarProyecto() {
    tecnologiasSeleccionadas = []; // limpiar tecnologias del proyecto anterior
    // limpiar campos del formulario
    document.getElementById("tags-tecnologias").innerHTML = "";
    document.getElementById("proyecto-nombre").value = "";
    document.getElementById("proyecto-descripcion").value = "";
    document.getElementById("proyecto-repositorio").value = "";
    document.getElementById("proyecto-tecnologias").value = "";
    // carga el catalogo de tecnologias
    cargarCatalogoTecnologias();
    // abre el modal de proyectos
    document.getElementById("modal-proyecto").classList.remove("oculto");
}

// cerrar el modal de proyectos
function cerrarModal() {
    document.getElementById("modal-proyecto").classList.add("oculto");
}

// funcion para seleccionar las tecnologias de un proyecto
function selectorTecnologias() {
    let select = document.getElementById("proyecto-tecnologias");

    select.addEventListener("change", function() {
        let idTecnologia = this.value; // id de la tecnologia seleccionada
        let nombreTecnologia = this.options[this.selectedIndex].getAttribute("data-nombre"); // nombre para mostrar

        // si no se selecciona nada retorna
        if (idTecnologia === "") return;

        // si ya esta en la lista retorna
        if (tecnologiasSeleccionadas.find(t => t.id === parseInt(idTecnologia))) {
            alert("Ya has seleccionado esta tecnologia.");
            this.value = "";
            return;
        }

        // agrega el objeto con id y nombre al arreglo
        tecnologiasSeleccionadas.push({ id: parseInt(idTecnologia), nombre: nombreTecnologia });

        // crea el tag visual
        let contenedor = document.getElementById("tags-tecnologias");
        let tag = document.createElement("span");
        tag.classList.add("tag-seleccionado");
        tag.setAttribute("data-id", idTecnologia);
        tag.innerHTML = nombreTecnologia + ' <button type="button" class="tag-quitar" onclick="quitarTecnologia(this)">X</button>';
        contenedor.appendChild(tag);

        // limpia el select
        this.value = "";
    });
}

// carga el selector al cargar la pagina
document.addEventListener("DOMContentLoaded", function() {
    selectorTecnologias();
});

// funcion para quitar una tecnologia seleccionada
function quitarTecnologia(boton) {
    let tag = boton.parentElement;
    let idTecnologia = parseInt(tag.getAttribute("data-id"));
    // filtra por id en lugar de nombre
    tecnologiasSeleccionadas = tecnologiasSeleccionadas.filter(t => t.id !== idTecnologia);
    tag.remove();
}

// funcion para guardar un proyecto nuevo o editado
function guardarProyecto() {
    let nombre = document.getElementById("proyecto-nombre").value.trim();
    let descripcion = document.getElementById("proyecto-descripcion").value.trim();
    let repositorio = document.getElementById("proyecto-repositorio").value.trim();
    let usuarioActual = localStorage.getItem("usuarioActual");

    // valida campos obligatorios
    if (nombre === "" || descripcion === "") {
        alert("Por favor, completa los campos obligatorios.");
        return;
    }

    // valida que el nombre del proyecto tenga al menos 3 caracteres
    if (nombre.trim().length < 3) {
        alert("El nombre del proyecto es demasiado corto");
        return;
    }

    // valida que la descripcion no supere los 300 caracteres
    if (descripcion.length > 300) {
        alert("La descripcion no puede ser mas grande que 300 caracteres");
        return;
    }

    // valida el repositorio si se ingreso uno
    if (repositorio !== "" && !regexRepositorio.test(repositorio)) {
        alert("Por favor, introduce un enlace de GitHub valido.");
        return;
    }

    // extrae solo los ids de las tecnologias para mandarselos a la api
    let idsTecnologias = tecnologiasSeleccionadas.map(t => t.id);

    // modo edicion
    if (proyectoEditarId !== null) {
        // fetch para actualizar el proyecto, manda el id en la url y los datos en el body
        fetch(`${API_URL}/proyectos/${proyectoEditarId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
                repo_url: repositorio,
                tecnologias: idsTecnologias
            })
        })
        .then(res => res.json())
        .then(datos => {
            if (datos.error) {
                alert(datos.error);
                return;
            }
            // limpiar el id de edicion, cierra el modal y recarga los proyectos
            proyectoEditarId = null;
            cerrarModal();
            cargarProyectos();
        })
        .catch(error => {
            alert("Error al conectar con el servidor.");
        });
        return;
    }

    // fecth para crear un nuevo proyecto, manda el id del estudiante en el body junto con los datos del proyecto para poder identificar el creeador
    fetch(`${API_URL}/proyectos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            estudiante_id: usuarioActual,
            nombre: nombre,
            descripcion: descripcion,
            repo_url: repositorio,
            tecnologias: idsTecnologias
        })
    })
    .then(res => res.json())
    .then(datos => {
        if (datos.error) {
            alert(datos.error);
            return;
        }
        cerrarModal();
        cargarProyectos();
    })
    .catch(error => {
        alert("Error al conectar con el servidor.");
    });
}

// funcion para cargar los proyectos del usuario loggeado
function cargarProyectos() {
    let usuarioActual = localStorage.getItem("usuarioActual");
    if (!usuarioActual) return;

    //fetch para obtener los proyectos del usuario loggeado, el id del usuario se manda en la url paracfiltrar por estudiante
    fetch(`${API_URL}/estudiantes/${usuarioActual}/proyectos`)
    .then(res => res.json())
    .then(proyectos => {
        let contenedor = document.getElementById("lista-proyectos");
        contenedor.innerHTML = "";

        // si no hay proyectos muestra un mensaje
        if (proyectos.length === 0) {
            contenedor.innerHTML = "<p class='mensaje-vacio'>Todavia no tienes proyectos.</p>";
            return;
        }

        // crea las tarjetas de cada proyecto y las agrega al contenedor
        proyectos.forEach(proyecto => {
            let card = document.createElement("div");
            card.classList.add("proyecto-card");
            card.innerHTML = `
                <div class="proyecto-card-header">
                <h3>${proyecto.nombre}</h3>
                </div>
                <p>${proyecto.descripcion}</p>
                ${proyecto.repo_url ? `<a href="${proyecto.repo_url}" target="_blank">Repositorio</a>` : ""}
                <div class="tecnologias-proyecto">
                </div>
                <div class="proyecto-card-botones">
                    <button class="btn-destacar" onclick="cambiarDestacado(${proyecto.id}, ${proyecto.destacado})">${proyecto.destacado ? "⭐ Destacado" : "☆ Destacar"}</button>
                    <button class="btn-editar" type="button" onclick="editarProyecto(${proyecto.id})">Editar</button>
                    <button class="btn-eliminar" type="button" onclick="eliminarProyecto(${proyecto.id})">Eliminar</button>
                </div>  
            `;
            contenedor.appendChild(card);

            // fetch que pide las tecnologias del proyecto y las agrega a la card
            fetch(`${API_URL}/proyectos/${proyecto.id}/tecnologias`)
            .then(res => res.json())
            .then(tecnologias => {
                let contenedorTecnologias = card.querySelector(".tecnologias-proyecto");
                tecnologias.forEach(t => {
                let tag = document.createElement("span");
                tag.classList.add("tag-tecnologia");
                tag.textContent = t.nombre;
                contenedorTecnologias.appendChild(tag);
                });
            });
        });
    })
    .catch(error => {
        console.log("Error al cargar proyectos:", error);
    });
}

// funcion para eliminar un proyecto
function eliminarProyecto(id) {
    if (!confirm("¿Eliminar proyecto?")) {
        return;
    }

    // fetch para eliminar el proyecto, manda el id
    fetch(`${API_URL}/proyectos/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(datos => {
        if (datos.error) {
            alert(datos.error);
            return;
        }
        cargarProyectos();
    })
    .catch(error => {
        alert("Error al conectar con el servidor.");
    });
}

// funcion para editar un proyecto
function editarProyecto(id) {
    // pide los datos del proyecto al servidor
    fetch(`${API_URL}/proyectos/${id}`)
    .then(res => res.json())
    .then(proyecto => {
        document.getElementById("proyecto-nombre").value = proyecto.nombre;
        document.getElementById("proyecto-descripcion").value = proyecto.descripcion;
        document.getElementById("proyecto-repositorio").value = proyecto.repo_url || "";

        // carga el catalogo de tecnologias primero y luego precarga las del proyecto
        cargarCatalogoTecnologias();

        // resetea las tecnologias seleccionadas
        tecnologiasSeleccionadas = (proyecto.tecnologias || []).map(t => ({ id: t.id, nombre: t.nombre }));
        document.getElementById("tags-tecnologias").innerHTML = "";
        tecnologiasSeleccionadas.forEach(t => {
            let tag = document.createElement("span");
            tag.classList.add("tag-seleccionado");
            tag.setAttribute("data-id", t.id);
            tag.innerHTML = t.nombre + ' <button type="button" class="tag-quitar" onclick="quitarTecnologia(this)">X</button>';
            document.getElementById("tags-tecnologias").appendChild(tag);
        });

        // abre el modal
        document.getElementById("modal-proyecto").classList.remove("oculto");
        proyectoEditarId = id;
    })
    .catch(error => {
        alert("Error al conectar con el servidor.");
    });
}


// funcion para destacar proyectos
function cambiarDestacado(id, destacadoActual) {
    // fetch para actualizar un proyecto y ponerlo destacado
    fetch(`${API_URL}/proyectos/${id}/destacado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            destacado: destacadoActual ? 0 : 1
        })
    })
    .then(res => res.json())
    .then(datos => {
        alert(datos.mensaje);
        cargarProyectos();
    })
    .catch(error => {
        alert("Error al actualizar el proyecto.");
    });
}