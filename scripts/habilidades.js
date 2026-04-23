// funcion para abrir el modal de agregar habilidades
function agregarHabilidad() {
    // limpia los campos
    document.getElementById("habilidad-nombre").value = "";
    document.getElementById("habilidad-nivel").value = "";
    // muestra el modal
    document.getElementById("modal-habilidad").classList.remove("oculto");
}

// funcion que cierra el modal
function cerrarModalHabilidad() {
    document.getElementById("modal-habilidad").classList.add("oculto");
}

// funcion para guardar una habilidad
function guardarHabilidad() {
    // toma los valores de los campos del modal
    let nombreHabilidad = document.getElementById("habilidad-nombre").value;
    let nivelHabilidad = document.getElementById("habilidad-nivel").value;

    // revisa que los campos no esten vacios
    if (nombreHabilidad === "" || nivelHabilidad === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // checa si se esta editando o creando
    if (editarHabilidadId !== null) {
        let usuarioActual = localStorage.getItem("usuarioActual");
        let clave = "habilidades_" + usuarioActual;
        let habilidadesGuardadas = JSON.parse(localStorage.getItem(clave)) || [];  
        // encuentra la habilidad que se esta editando
        let habilidades = habilidadesGuardadas.findIndex(h => h.id === editarHabilidadId);
        // actualiza la habilidad con los nuevos datos
        habilidadesGuardadas[habilidades] = {
            id: editarHabilidadId,
            nombre: nombreHabilidad,
            nivel: nivelHabilidad
        };
        localStorage.setItem(clave, JSON.stringify(habilidadesGuardadas)); // guarda la habilidad editada
        editarHabilidadId = null; // resetea la variable de habilidad a editar
        // cierra el modal y recarga las habilidades
        cerrarModalHabilidad();
        cargarHabilidades();
        return;
    }

    // si no se esta editando, crea una nueva habilidad
    let habilidad = {
        id: Date.now(),
        nombre: nombreHabilidad,
        nivel: nivelHabilidad
    };

    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "habilidades_" + usuarioActual;
    let habilidadesGuardadas = JSON.parse(localStorage.getItem(clave)) || [];
    habilidadesGuardadas.push(habilidad);// agrega la nueva habilidad a las habilidades guardadas
    localStorage.setItem(clave, JSON.stringify(habilidadesGuardadas));// guarda las habilidades con la nueva habilidad incluida
    // cierra el modal y recarga las habilidades
    cerrarModalHabilidad();
    cargarHabilidades();
}

// funcion para cargar las habilidades
function cargarHabilidades() {
    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "habilidades_" + usuarioActual;
    let habilidadesGuardadas = JSON.parse(localStorage.getItem(clave)) || [];
    // trae el contenedior de las habilidades y lo limpia para cargar las habilidades
    let contenedor = document.getElementById("lista-habilidades");
    contenedor.innerHTML = "";

    // recorre las habilidades
    habilidadesGuardadas.forEach(habilidad => {
        let card = document.createElement("div"); // crea una carta para cada habilidad
        card.classList.add("habilidad-card"); //le pone css
        // a cada carta le agrega el contenido y los botones de editar y eliminar
        card.innerHTML = `
            <h4>${habilidad.nombre}</h4>
            <p>Nivel: ${habilidad.nivel}</p>
            <div class="proyecto-card-botones">
            <button onclick="editarHabilidad(${habilidad.id})">✎ Editar</button>
            <button onclick="eliminarHabilidad(${habilidad.id})">🗑 Eliminar</button>
            </div>
        `;
        contenedor.appendChild(card);// mete la carta al contenedor de habilidades
    });
}

// funcion para eliminar una habilidad
function eliminarHabilidad(id) {
    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "habilidades_" + usuarioActual;
    // filtra las habilidades guardadas para eliminar la habilidad con el id
    let habilidadesGuardadas = JSON.parse(localStorage.getItem(clave));
    habilidadesGuardadas = habilidadesGuardadas.filter(h => h.id !== id);// toma las habilidades sin la habilidad eliminada
    localStorage.setItem(clave, JSON.stringify(habilidadesGuardadas));// guarda las habilidades sin la habilidad eliminada
    cargarHabilidades(); // recarga las habilidades para mostrar los cambios
}

// funcion para editar una habilidad
function editarHabilidad(id) {
    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "habilidades_" + usuarioActual;
    let habilidadesGuardadas = JSON.parse(localStorage.getItem(clave)) || [];
    // encuentra la habilidad que se quiere editar
    let habilidad = habilidadesGuardadas.find(h => h.id === id);
    // mete la informacion de la habilidad en los campos del modal para editarla
    document.getElementById("habilidad-nombre").value = habilidad.nombre;
    document.getElementById("habilidad-nivel").value = habilidad.nivel;
    document.getElementById("modal-habilidad").classList.remove("oculto");//abre el modal
    editarHabilidadId = id;//pone el id de la habilidad que se va a editar
}