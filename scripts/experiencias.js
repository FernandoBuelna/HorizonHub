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
    // toma los valores de los campos del modal
    let nombreExperiencia = document.getElementById("experiencia-nombre").value.trim();
    let institucionExperiencia = document.getElementById("experiencia-institucion").value.trim();
    let tipoExperiencia = document.getElementById("experiencia-tipo").value;
    let fechaInicio = document.getElementById("experiencia-inicio").value;
    let fechaFin = document.getElementById("experiencia-fin").value || "No terminada"; //si no se agrega fecha de fin se coloca como no terminada
    let descripcionExperiencia = document.getElementById("experiencia-descripcion").value.trim() || "No se ingreso descripcion"; // si no se agrega descripcion se pone que no se ingreso

    // revisa que los campos obligatorios no esten vacios
    if (nombreExperiencia === "" || institucionExperiencia === "" || tipoExperiencia === "" || fechaInicio === "") {
        alert("Por favor, completa los campos obligatorios.");
        return;
    }

    //checa si se esta editando o creando
    if (editarExperienciaId !== null) {
        let usuarioActual = localStorage.getItem("usuarioActual");
        let clave = "experiencias_" + usuarioActual;
        let experienciasGuardadas = JSON.parse(localStorage.getItem(clave)) || [];

        // encuentra la experiencia que se esta editando
        let experiencia = experienciasGuardadas.findIndex(e => e.id === editarExperienciaId);
        // actualiza la experiencia con los nuevos datos
        experienciasGuardadas[experiencia] = {
            id: editarExperienciaId,
            nombre: nombreExperiencia,
            institucion: institucionExperiencia,
            tipo: tipoExperiencia,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            descripcion: descripcionExperiencia
        };
        localStorage.setItem(clave, JSON.stringify(experienciasGuardadas)); // guarda la experiencia editada
        editarExperienciaId = null; // resetea la variable de experiencia a editar
        // cierra el modal y recarga las experiencias
        cerrarModalExperiencia(); 
        cargarExperiencias();
        return;
    }

    // si se esta creando una nueva experiencia, crea la nueva experiencia
    let experiencia = {
        id: Date.now(),
        nombre: nombreExperiencia,
        institucion: institucionExperiencia,
        tipo: tipoExperiencia,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        descripcion: descripcionExperiencia
    };

    // sigue el mismo camino de editar pero sin buscar la experiencia, solo mete una nueva a la lista
    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "experiencias_" + usuarioActual; // la clave de experiencias es experiencias_idUsuario
    let experienciasGuardadas = JSON.parse(localStorage.getItem(clave)) || [];
    experienciasGuardadas.push(experiencia);// mete la nueva experiencia a la lista de experiencias guardadas
    localStorage.setItem(clave, JSON.stringify(experienciasGuardadas));// guarda la nueva experiencia
    // cierra el modal y recarga las experiencias
    cerrarModalExperiencia();
    cargarExperiencias();
}

// funcion para cargar las experiencias
function cargarExperiencias() {
    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "experiencias_" + usuarioActual;
    let experienciasGuardadas = JSON.parse(localStorage.getItem(clave)) || [];
    //trae el contenedor de experiencias y lo limpia para cargar las experiencias guardadas
    let contenedor = document.getElementById("lista-experiencias");
    contenedor.innerHTML = "";

    // recorre las experiencias guardadas
    experienciasGuardadas.forEach(experiencia => {
        let card = document.createElement("div");// crea un div para la carta de la experiencia
        card.classList.add("experiencia-card");// le agrega css
        // mete la informacion de la experiencia en la carta y botones para editar y eliminar
        card.innerHTML = `
            <h4>${experiencia.nombre}</h4>
            <h3>Institucion: ${experiencia.institucion}</h3>
            <h2>Tipo: ${experiencia.tipo}</h2>
            <p>Fecha Inicio: ${experiencia.fechaInicio}, Fecha Fin: ${experiencia.fechaFin}</p>
            <p>Descripcion: ${experiencia.descripcion}</p>
            <div class="proyecto-card-botones">
            <button onclick="editarExperiencia(${experiencia.id})">✎ Editar</button>
            <button onclick="eliminarExperiencia(${experiencia.id})">🗑 Eliminar</button>
            </div>
        `;
        contenedor.appendChild(card);// mete la carta al contenedor de experiencias
    });
}

// funcion para eliminar una experiencia
function eliminarExperiencia(id) {
    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "experiencias_" + usuarioActual;
    let experienciasGuardadas = JSON.parse(localStorage.getItem(clave));// 1trae las experiencias guardadas
    experienciasGuardadas = experienciasGuardadas.filter(e => e.id !== id);// filtra la experiencia que se quiere eliminar
    localStorage.setItem(clave, JSON.stringify(experienciasGuardadas));// guarda la lista de experiencias sin la experiencia eliminada
    cargarExperiencias();// recarga las experiencias
}

// funcion para editar una experiencia
function editarExperiencia(id) {
    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "experiencias_" + usuarioActual;
    let experienciasGuardadas = JSON.parse(localStorage.getItem(clave)) || [];
    let experiencia = experienciasGuardadas.find(e => e.id === id);// encuentra la experiencia que se quiere editar
    // mete la informacion de la experiencia en los campos del modal para editarla
    nombreExperiencia = document.getElementById("experiencia-nombre").value = experiencia.nombre;
    institucionExperiencia = document.getElementById("experiencia-institucion").value = experiencia.institucion;
    tipoExperiencia = document.getElementById("experiencia-tipo").value = experiencia.tipo;
    fechaInicio = document.getElementById("experiencia-inicio").value = experiencia.fechaInicio;
    fechaFin = document.getElementById("experiencia-fin").value = experiencia.fechaFin;
    descripcionExperiencia = document.getElementById("experiencia-descripcion").value = experiencia.descripcion;
    document.getElementById("modal-experiencia").classList.remove("oculto");// abre el modal para editar la experiencia
    editarExperienciaId = id;// guarda el id de la experiencia que se esta editando para saber que experiencia editar al guardar los cambios
}

cargarPerfil();
navegarSeciones();
